import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsShowingCart } from '../store/slices/isShowingCart.slice';
import { getCartThunk } from '../store/slices/cart.slice';
import { deleteProductInCart, purchaseCartThunk, updateProductInCartThunk } from '../store/slices/cart.slice';
import { setIsCartWithProducts } from '../store/slices/isCartWithProducts.slice';
import { useNavigate } from 'react-router-dom';
import { setIsPurchases } from '../store/slices/isPurchases';

const Cart = () => {

  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const products = useSelector(state => state.products);
  const isCartWithProducts = useSelector(state => state.isCartWithProducts)

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCartThunk());
    setTimeout(() => {
      document.getElementById('cart-overlay')?.classList.add('cart-overlay__appear');
      document.getElementById('cart-container')?.classList.add('cart-container__appear');
    }, 1);
  }, [])
  //console.log(cart)

  if(cart.length === 0){
    dispatch(setIsCartWithProducts(false))
  }

  const itemImage = (item) => {
    for(let i in products){
      if(products[i]?.id === item?.id){
        return products[i].images[0].url
      }
    }
  }

  const itemTotal = (item) => {
    const total = (item.quantity * item.product?.price)
    return total
  }

  const productsTotal = () => {
    let sum = 0
    for(let i in cart){
      sum = sum + (cart[i].quantity * cart[i].product.price)
    }
    return sum
  }

  const deleteProduct = (item) => {
    dispatch(deleteProductInCart(item.id))
  }

  const purchaseCart = () => {
    document.getElementById('cart-overlay')?.classList.remove('cart-overlay__appear');
    document.getElementById('cart-container')?.classList.remove('cart-container__appear');
    setTimeout(() => {
      dispatch(setIsShowingCart(false));
    }, 500);
    dispatch(purchaseCartThunk());
    navigate('/purchases');
    window.scrollTo(0, 0);
  }

  const updateAddProduct = (item) => {
    const productUpdated = {
      id: item.id,
      newQuantity: {
        "quantity": (item.quantity + 1)
      }
    }

    dispatch(updateProductInCartThunk(productUpdated))
  }

  const updateSubstractProduct = (item) => {
    if(item.quantity > 1){
      const productUpdated = {
        id: item.id,
        newQuantity: {
          "quantity": (item.quantity - 1)
        }
      }

      dispatch(updateProductInCartThunk(productUpdated))
    }
  }

  const closeCart = () => {
    document.getElementById('cart-overlay')?.classList.remove('cart-overlay__appear');
    document.getElementById('cart-container')?.classList.remove('cart-container__appear');
    setTimeout(() => {
      dispatch(setIsShowingCart(false));
    }, 500);
  }

  return (
    <div className='cart-overlay' id='cart-overlay'>
      <div className="cart_empty" onClick={closeCart}></div>
      <div className="cart-container" id='cart-container'>
        <div className='cart-close-btn'>
          <button onClick={closeCart}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {isCartWithProducts ?
        (
        <div className="cart-data-container">
          <div className="cart-items-container">
            <h2>Shopping cart</h2>
            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  <div className="cart-item-img-description">
                    <div className="cart-item-img">
                      <img src={itemImage(item.product)} alt="" />
                    </div>
                    <div className="cart-item-description">
                      <div className="cart-item-brand-price">
                        <p>{item.product.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pd-line"></div>
                  <div className="cart-item-price">
                    <p>${itemTotal(item)}{item.quantity > 1 && ` x ${item.quantity}`}</p>
                  </div>
                  <div className="cart-item-quantity-options">
                    <div className="cart-item-options">
                      <button onClick={() => updateAddProduct(item)}>+</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateSubstractProduct(item)}>-</button>
                    </div>
                    <div>
                      <button className='cart-item-delete-btn' onClick={() => deleteProduct(item)}>
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="cart-total-pay-container">
            <p>Total: ${productsTotal()}</p>
            <button className='cart-checkout-btn' onClick={purchaseCart}>
              <h3>CHECKOUT</h3>
            </button>
          </div>
        </div>
        ) : (
          <div className='cart-empty'>
            <h2>Your cart is empty <i className="bi bi-emoji-frown"></i></h2>
            <i className="bi bi-cart"></i>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default Cart;