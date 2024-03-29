import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FilterByCategory from '../components/FilterByCategory';
import { getProductsThunk, filterProductsThunk } from '../store/slices/products.slice';
import { setIsShowing } from '../store/slices/isShowing.slice'
import { useNavigate } from 'react-router-dom'
import { setShowAll } from '../store/slices/showAll.slice';
import { setIsLoggedIn } from '../store/slices/isLoggedIn';
import { setIsLoggedOut } from '../store/slices/isLoggedOut';

const Home = () => {

  // React
  const [searchedValue, setSearchedValue] = useState('');
  const [ categories, setCategories ] = useState([]);
  const [ productInput, setProductInput ] = useState(1);

  // Router DOM
  const navigate = useNavigate();

  // Redux
  const products = useSelector(state => state.products);
  const isShowing = useSelector(state => state.isShowing);
  const showAll = useSelector(state => state.showAll);
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isLoggedOut = useSelector(state => state.isLoggedOut);
  const dispatch = useDispatch();
  
  useEffect(() => {

    if (showAll) {

    } else {
      dispatch(getProductsThunk());
    }

    window.scrollTo(0, 0);
    // Categories
    axios.get('https://e-commerce-api-v2.academlo.tech/api/v1/categories')
    .then(res => setCategories(res.data))

    setTimeout(() => {      
      if (isLoggedIn) {
        dispatch(setIsLoggedIn(!isLoggedIn));
        document.getElementById('logged-in').classList.add('active__logged-in');
        setTimeout(() => {
          document.getElementById('logged-in').classList.remove('active__logged-in');
        }, 2500);
      }
    }, 10)

    setTimeout(() => {      
      if (isLoggedOut) {
        dispatch(setIsLoggedOut(!isLoggedOut));
        document.getElementById('logged-out').classList.add('active__logged-out');
        setTimeout(() => {
          document.getElementById('logged-out').classList.remove('active__logged-out');
        }, 2500);
      }
    }, 10)

  }, []);
  //console.log(products)
  //console.log(categories)
  
  const searchedValueFixed = `${searchedValue[0]?.toUpperCase()}${searchedValue.substring(1).toLowerCase()}`;
  //console.log(searchedValueFixed);
  
  const submitForm = (e) => {
    e.preventDefault();
    dispatch(filterProductsThunk(searchedValueFixed));
    dispatch(setShowAll(true));
  };

  const selectProduct = (id) => {
    navigate(`/product/${id}`)
    window.scrollTo(0, 0);
  };

  const fillLine = () => {
    document.getElementById('line-bar__home').classList.add('fill');
  }

  const unfillLine = () => {
    document.getElementById('line-bar__home').classList.remove('fill');
  }

  const filterNav = () => {
    dispatch(setIsShowing(true));
  }
  
  return (
    <div className="home__container">
      <div className="pop-up__logged-in" id='logged-in'>
        <p>Welcome, let's buy!</p>
      </div>
      <div className="pop-up__logged-out" id='logged-out'>
        <p>See you later!</p>
      </div>
      <div className="home__menu">
        <div className="input-container" data-aos="fade-up">
          <form onSubmit={submitForm}>
            <input
              type="text"
              placeholder='Find a product...'
              name='find-product'
              onChange={e => setSearchedValue(e.target.value)}
              value={searchedValue}
              onFocus={fillLine}
              onBlur={unfillLine}
            />
            <button>
              <i className="bi bi-search"></i>
            </button>
          </form>
          <div className="line-bar" id='line-bar__home'></div>
        </div>
        <div className="filter-container" data-aos="fade-up">
          {showAll &&
            <button className='filter-container__show-all' onClick={(e) => {
              dispatch(getProductsThunk())
              window.scrollTo(0, 0)}}>
              SHOW ALL PRODUCTS
            </button>
          }
          <button onClick={filterNav} className='btn-for-filter'>
            <i className="bi bi-sliders"></i>
            <p className="btn-for-filter__text show-desktop">Filter</p>
          </button>
          {isShowing &&
            <FilterByCategory categories={categories}/>
          }
        </div>
      </div>
      <div className='products-ul-container'>
        <ul>
          {products.map(product => (
            <li key={product.id} className='product-card' data-aos="fade-up" onClick={() => selectProduct(product.id)}>

                <div className="product-image">
                  <img src={product.images?.[0].url} alt="" />
                </div>
                <div className="product-line"></div>

              <div className="product-description">
                <div className="product-title">
                  <p><b>{product.title}</b></p>
                </div>
                <div className="product-price-buy">
                  <div className="product-price">
                    <p><b>Price</b></p>
                    <p>${product.price}</p>
                  </div>
                  {/*<div className="product-button">
                    <button className='add-product-btn'>
                      <i className='bx bxs-cart-add bx-xs' ></i>
                    </button>
                  </div>*/}
                  <div className="line-bar"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;