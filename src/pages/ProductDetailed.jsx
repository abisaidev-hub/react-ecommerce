import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsThunk, filterByCategoryThunk } from '../store/slices/products.slice';
import { useNavigate, useParams } from 'react-router-dom'
import { addProductToCartThunk } from '../store/slices/cart.slice';

const ProductDetailed = () => {

  const token = localStorage.getItem('token');

  // React
  const [productData, setProductData] = useState({});
  const [sugestedProducts, setSugestedProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1)

  // Router DOM
  const { productId } = useParams();
  const navigate = useNavigate();

  // Redux
  const allProducts = useSelector(state => state.products)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsThunk());
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    const productSelected = allProducts.find(product => product.id === Number(productId));
    //console.log(productSelected);

    if (productSelected) {      
      setProductData(productSelected);
      // Sugested products filtering
      const filteredProducts = allProducts.filter(product => product.category.id === productSelected.category.id);
      const filteredProductsFixed = filteredProducts.filter(product => product.id !== productSelected.id);
      setSugestedProducts(filteredProductsFixed);
    }

    const timer = setTimeout(() => {      
      if (!productSelected) {
        navigate('/product/error/404')
      }
    }, 3000);
    return () => clearTimeout(timer);

  }, [allProducts, productId, navigate]);
  
  //console.log(productData)
  //console.log(sugestedProducts)

  const addProduct = () => {
    const productToAdd = {
      quantity: productQuantity,
      productId: Number(productId)
    }
    //console.log(productToAdd)
    dispatch(addProductToCartThunk(productToAdd))
  }

  const addQuantity = () => {
    setProductQuantity(productQuantity + 1)
  }

  const substractQuantity = () => {
    if(productQuantity > 1){
      setProductQuantity(productQuantity - 1)
    }
  }

  const selectImage = (url) => {
    let mainImg = document.getElementById('main-image');
    mainImg.src = url;
  }

  return (
    <div className='product-detailed-container'>
      <div className="pd-btn-container" data-aos="fade-right">
        <button onClick={() => navigate('/') /*-1*/}>
          <i className="bi bi-arrow-left"></i>
          <p>BACK</p>
        </button>
      </div>
      <div className="pd-category-container" data-aos="fade-up">
        <div className='pd-category-container__category'>
          <p>{productData?.category?.name?.toUpperCase()}</p>
        </div>
        <p>•</p>
        <div className="pd-category-container__brand">
          <p>{productData?.brand?.toUpperCase()}</p>
        </div>
      </div>
      <div className="product-desc-buy">
        <div className="product-container__container" data-aos="fade-up">
          <div className="product-container">
            <h2>{productData?.title}</h2>
            <div className="pd-img-container">
              <div className="pd-img-container__img">
                <img src={productData?.images?.[0].url} id='main-image'/>
              </div>
              <ul className="pd-img-container__imgs">
                {productData?.images?.map(image => (
                  <li className='imgs__img' onClick={() => selectImage(image.url)} key={image.url}>
                    <img src={image.url}/>
                  </li>
                ))
                }
              </ul>
            </div>
            <div className="pd-line"></div>
            <div className="product-price-buy">
              <div className="product-price">
                <h3>Price</h3>
                <p>${productData?.price}</p>
              </div>
              <div className="pd-product-button">
                <div className="pd-product-quantity">
                  <button onClick={addQuantity}>+</button>
                  <span>{productQuantity}</span>
                  <button onClick={substractQuantity}>-</button>
                </div>
                <button className='pd-add-product-btn' onClick={() => {token ? addProduct() : navigate('/login')}}>
                  <h3>ADD TO CART</h3>
                </button>
              </div>
            </div>
          </div>
          <div className="pd-line"></div>
        </div>
        <div className="pd-description-container">
          <div className="pd-description-container__description" data-aos="fade-up">
            <div className="description-container">
              <h3>Product details</h3>
              <p>{productData?.description}</p>
            </div>
            <div className="line-bar"></div>
          </div>
          <div className="pd-description-container__additional" data-aos="fade-up">
            <div className="additional-container">
              <i className="bi bi-credit-card"></i>
              <div className="additional-container__description">
                <h3>PAYMENT</h3>
                <p>Credit card, debit card or PayPal</p>
              </div>
            </div>
            <div className="additional-container">
              <i className="bi bi-truck"></i>
              <div className="additional-container__description">
                <h3>SHIPPING & DELIVERY</h3>
                <p>Complimentary Green Delivery</p>
              </div>
            </div>
            <div className="additional-container">
              <i className="bi bi-arrow-counterclockwise"></i>
              <div className="additional-container__description">
                <h3>RETURNS & EXCHANGES</h3>
                <p>Complimentary</p>
              </div>
            </div>
            <div className="line-bar"></div>
          </div>
        </div>
      </div>
      <div className="pd-sugested-products-container">
        <h3 data-aos="fade-up">You may like...</h3>
        <div className="pd-sugested-products-ul">
          <ul>
            {sugestedProducts.map(sugestedProduct => (
              <li key={sugestedProduct.id} data-aos="fade-up" onClick={() => {
                navigate(`/product/${sugestedProduct.id}`)
                window.scrollTo(0, 0);
              }}>
                <div className="pd-sugested-product-img-txt">
                  <div className="pd-sugested-product-img">
                    <img src={sugestedProduct.images[0].url} alt="" />
                  </div>
                  <div className="pd-line"></div>
                  <p><b>{sugestedProduct.title}</b></p>
                </div>
                <div className="product-price-buy">
                  <div className="product-price">
                    <p><b>Price</b></p>
                    <p>${sugestedProduct?.price}</p>
                  </div>
                  {/*<div className="product-button">
                    <button className='add-product-btn'>
                      <i className='bx bxs-cart-add bx-xs' ></i>
                    </button>
                  </div>*/}
                  <div className="line-bar"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailed;