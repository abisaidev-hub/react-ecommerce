import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/user.slice';
import { setIsShowingPassword } from '../store/slices/isShowingPassword.slice';
import { setUserCreated } from '../store/slices/userCreated';
import { setIsLoggedIn } from '../store/slices/isLoggedIn';

const Login = () => {

  const [ isSelected, setIsSelected ] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate('/')
  const { register, reset, handleSubmit } = useForm();

  const isShowingPassword = useSelector(state => state.isShowingPassword);
  const userCreated = useSelector(state => state.userCreated);
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  useEffect(() => {
    dispatch(setIsShowingPassword(false))
    window.scrollTo(0, 0);
    setTimeout(() => {      
      if (userCreated) {
        document.getElementById('user-created').classList.add('active__user-created');
        setTimeout(() => {
          document.getElementById('user-created').classList.remove('active__user-created');
          dispatch(setUserCreated(!userCreated));
        }, 3000);
      }
    }, 10)
  }, [])

  const userFormSubmit = (obj) => {
    //console.log(obj)

    axios.post('https://e-commerce-api-v2.academlo.tech/api/v1/users/login', obj)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', `${res.data.user.firstName} ${res.data.user.lastName}`);
        dispatch(setUser(res.data.data));
        dispatch(setIsLoggedIn(!isLoggedIn));
        navigate('/');
        window.scrollTo(0, 0);
        //console.log(res.data)
      })
      .catch(err => {
        if(err){
          //alert('Invalid username and/or password');
          //console.error(err);
          document.getElementById('login-failed').classList.add('active__login-failed');
          setTimeout(() => {
            document.getElementById('login-failed').classList.remove('active__login-failed');
          }, 3000);
        }
      });
    /*reset({
      email: '',
      password: ''
    });*/
  }

  const useTestCredentials = () => {
    setIsSelected(true)
    register({
      email: 'abisai@test.com',
      password: 'test1234'
    })
  }

  const fillLineEmail = () => {
    document.getElementById('line-bar__email').classList.add('fill');
  };
  const unfillLineEmail = () => {
    document.getElementById('line-bar__email').classList.remove('fill');
  };

  const fillLinePassword = () => {
    document.getElementById('line-bar__pw').classList.add('fill');
  };
  const unfillLinePassword = () => {
    document.getElementById('line-bar__pw').classList.remove('fill');
  };

  return (
    <div className='login-container'>
      <div className="pop-up__login-failed" id='login-failed'>
        <p>Invalid email or password</p>
      </div>
      <div className="pop-up__user-created" id='user-created'>
        <p>User created successfully!</p>
      </div>
      <div className="login-form-container" data-aos="fade-down">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(userFormSubmit)}>
          <div className="login-input-container">
            <label htmlFor="email">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              id='email'
              placeholder='name@example.com'
              onFocus={fillLineEmail}
              {...register('email')}
              onBlur={unfillLineEmail}
              required
            />
            <div className="line-bar" id='line-bar__email'></div>
          </div>
          <div className="login-input-container">
            <label htmlFor="password">
              PASSWORD
            </label>
            <div className="lg-input-container">
              <input
                type={isShowingPassword ? "text" : 'password'}
                id='password'
                placeholder='Password'
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
            <div className="line-bar" id='line-bar__pw'></div>
          </div>
          <button><h3>LOGIN</h3></button>
        </form>
      </div>
      <div className="login__signup" data-aos="fade-up">
        <button onClick={() => navigate('/signup')}>
          I WANT TO CREATE AN ACCOUNT
          <div className="line-bar"></div>
        </button>
      </div>
      <div className="login-test-container" data-aos="fade-up">
        <p>DON'T WANT TO CREATE AN ACCOUNT? YOU CAN USE THE FOLLOWING CREDENTIALS</p>
        <div className="login-test-credentials-container">
          <p>abisai@test.com</p>
          <p>test1234</p>
          {/*<button onClick={useTestCredentials}>Use credentials</button>*/}
        </div>
        <p>FOR <b>FULL EXPERIENCE</b>, PLEASE CREATE AN ACCOUNT<br/>&#40;HIGHLY RECOMMENDED <i className="bi bi-emoji-smile"></i>&#41;</p>
      </div>
    </div>
  );
};

export default Login;