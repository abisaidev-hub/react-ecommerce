import React, { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { setIsShowingPassword } from '../store/slices/isShowingPassword.slice';
import { setUserCreated } from "../store/slices/userCreated";

const Signup = () => {

  useEffect(() => {
    dispatch(setIsShowingPassword(false))
    window.scrollTo(0, 0);
  }, [])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, reset, handleSubmit } = useForm();

  const isShowingPassword = useSelector(state => state.isShowingPassword);
  const userCreated = useSelector(state => state.userCreated);

  const fillLinePassword = () => {
    document.getElementById('line-bar__pw').classList.add('fill');
  };
  const unfillLinePassword = () => {
    document.getElementById('line-bar__pw').classList.remove('fill');
  };

  const signup = (data) => {
    //console.log(data)
    axios.post('https://e-commerce-api-v2.academlo.tech/api/v1/users', data)
      .then(() => {
        dispatch(setUserCreated(!userCreated));
        navigate('/login');
        window.scrollTo(0, 0);
      })
      .catch(err => {
        if(err){
          //alert('Invalid username and/or password');
          //console.error(err);
          document.getElementById('signup-failed')?.classList.add('active__signup-failed');
          setTimeout(() => {
            document.getElementById('signup-failed')?.classList.remove('active__signup-failed');
          }, 3000);
        }
      })
    /*reset({
      email: '',
      password: ''
    });*/
  }

  return (
    <div className="signup__container">
      <div className="pop-up__signup-failed" id='signup-failed'>
        <p>The email is already in used</p>
        {/*<div className="signup-failed__desc">
            <p>- The email is already in used<br />
            - Information required:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Email address<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• First name<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Last name<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Password</p>
        </div>*/}
      </div>
      <div className="signup__form-container" data-aos="fade-down">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit(signup)}>
          <div className="signup__input-container">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              required
              {...register('email')}
            />
            <div className="line-bar" id="line-bar__signup"></div>
          </div>
          <div className="signup__input-container">
            <label htmlFor="first-name">FIRST NAME</label>
            <input
              type="text"
              id="first-name"
              placeholder="John"
              required
              {...register('firstName')}
            />
            <div className="line-bar" id="line-bar__signup"></div>
          </div>
          <div className="signup__input-container">
            <label htmlFor="last-name">LAST NAME</label>
            <input
              type="text"
              id="last-name"
              placeholder="Doe"
              required
              {...register('lastName')}
            />
            <div className="line-bar" id="line-bar__signup"></div>
          </div>
          <div className="signup__input-container">
            <label htmlFor="password">PASSWORD</label>
            <div className="signup__input-pw">
              <input
                type={isShowingPassword ? "text" : 'password'}
                id="password"
                placeholder="Password"
                onFocus={fillLinePassword}
                {...register('password')}
                onBlur={unfillLinePassword}
                required
              />
              {isShowingPassword ?
                (
                  <i className="bi bi-eye-slash-fill"
                    onClick={() => dispatch(setIsShowingPassword(!isShowingPassword))}
                  ></i>
                ) : (
                  <i className="bi bi-eye-fill"
                    onClick={() => dispatch(setIsShowingPassword(!isShowingPassword))}
                  ></i>
              )}
            </div>
            <div className="line-bar" id="line-bar__pw"></div>
          </div>
          <div className="signup__input-container">
            <label htmlFor="phone">PHONE {'(OPTIONAL)'}</label>
            <input
              type="text"
              id="phone"
              placeholder="111 222 3333"
              {...register('phone')}
            />
            <div className="line-bar" id="line-bar__signup"></div>
          </div>
          <button><h3>CREATE ACCOUNT</h3></button>
        </form>
      </div>
      <div className="signup__login">
        <button onClick={() => navigate('/login')}>
          I ALREADY HAVE AN ACCOUNT
          <div className="line-bar"></div>
        </button>
      </div>
    </div>
  );
};

export default Signup;