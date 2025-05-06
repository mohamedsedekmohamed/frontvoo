import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loginpic from '../assets/login.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Login({ setIsLoggedIn,setorganiztionLayout }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // const togglePasswordVisibility = () => setShowPassword(!showPassword);
useEffect(()=>{
  localStorage.removeItem('token');

},[])
  const handleLogin = () => {
  
    
      axios.post('https://backndVoo.voo-hub.com/api/login', { 
        email: username, 
        password: password 
      })
      .then(response => {
        if (response.data.user.role=== "admin") {
          localStorage.setItem('token', response.data.token);
          toast.success("Welcome !");
       
          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(false);
            navigate('/admin/home');
          }, 3000); 
        } else if (response.data.user.role === "organization") {
          toast.success("Welcome !");
              localStorage.setItem('token', response.data.token);

          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(true);
            navigate('/organiztion/user');
          }, 3000);         
        }
      })
      .catch(() => {
        toast.error('Connection failed');
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
            className='w-[300px] md:w-[450px] h-[72px] border-one border-1 rounded-[8px] mt-2 lg:mt-5 pl-3'
            placeholder='Email'
          />

<div className='relative mt-2'>
<input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-[300px] md:w-[450px] h-[72px] border border-one rounded-[8px] pl-3 pr-12"
        placeholder="Password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none"
      >
        {/* {showPassword ? (
          <FiEyeOff size={24} />
        ) : (
          <FiEye size={24} />
        )} */}
      </button>
</div>

          <button onClick={handleLogin} className='w-[300px] md:w-[450px] h-[72px] bg-one rounded-[8px] mt-5 text-white font-medium
          transition transform hover:scale-90
          '>
            Login
          </button>
        </div>
      </div>

      <div className='hidden md:flex'>
        <img src={Loginpic} className='object-fill w-full h-screen max-h-[800px]' alt="Login visual" />
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
