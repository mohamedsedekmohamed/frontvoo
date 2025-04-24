import React, { useEffect, useState } from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loginpic from '../assets/Login.png'
import { useLocation, useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  // useEffect(() => {
  //   navigate('/admin/home', { replace: true, state: location.state });
  // },[location.state, navigate]);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

    const handleLogin = () => {
    setLoading(true);
    localStorage.removeItem('token');
    axios
      .post('https://backndVoo.voo-hub.com/api/login', { 
        email: username, 
        password: password
      })
      .then((response) => {
        setData(response.data);
        if (response.data.message === "User successfully logged in") {
          localStorage.setItem('token', response.data.token);
          console.log(response.data.token);
          toast.success(`welcome`);

          setTimeout(() => {
            setIsLoggedIn(true);  
          }, 2000);

        } else {
          toast.error(' write email or password right');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        toast.error(' Connection failed ');
      });
  };


  return (
    <div className='w-screen h-screen grid md:grid-cols-2 gap-2'>
      <div className='flex justify-between items-start'>
        <div className='flex flex-col mt-[5%] ml-[8%]'>
          <span className='text-2xl lg:text-5xl text-one font-medium'>Login</span> 
          <span className='text-[24px] lg:text-[50px] pt-5 lg:pt-10'>Welcome back</span>
          <span className='text-[16px] lg:text-[24px] mt-1'>Log in to your account</span>

          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-[450px] h-[72px]  lg:h-[72px] border-one border-1 rounded-[8px] mt-2 lg:mt-5 pl-3'
            placeholder='email'
          />

          <div className='relative'>
            <button
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword === true && (<FaRegEyeSlash className='absolute top-1/3 lg:top-1/2         right-25   sm:right-30  md:right-30      lg:right-10   text-2xl' />)}
              {showPassword === false && (<MdOutlineRemoveRedEye className='absolute top-1/3 lg:top-1/2  right-25  sm:right-30   md:right-30   lg:right-10 text-2xl' />)}
            </button>
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-[450px] h-[56px]  lg:h-[72px] border-one border-1 rounded-[8px] mt-2 lg:mt-5 pl-3'
              placeholder='password'
            />
          </div>

          <button onClick={handleLogin} className='w-[450px] h-[72px] bg-one rounded-[8px] mt-5 lg:mt-10 text-white font-medium'>
            send
          </button>
        </div>
      </div>

      <div className='hidden md:flex'>
      <img src={Loginpic} className='object-fill w-full h-screen max-h-[800px]' />
      </div>
            <ToastContainer />
      
    </div>
  );
}

export default Login;


