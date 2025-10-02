import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loginpic from '../assets/login.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Voologo from '../assets/Voologo.png';

function Login({ setIsLoggedIn, setorganiztionLayout }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  // التحقق من صحة الإيميل
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    // التحقق قبل الإرسال
    if (!username) {
      toast.error("Email is required");
      return;
    }
    if (!isValidEmail(username)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    axios.post('https://backndVoo.voo-hub.com/api/login', {
      email: username,
      password: password
    })
      .then(response => {
        if (response.data.user.role === "admin") {
          localStorage.setItem('token', response.data.token);
          toast.success("Welcome Admin!");
          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(false);
            navigate('/admin/home');
          }, 2000);
        } else if (response.data.user.role === "organization") {
          localStorage.setItem('token', response.data.token);
          toast.success("Welcome Organization!");
          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(true);
            navigate('/organiztion/home');
          }, 2000);
        }
      })
    .catch((error) => {
  if (error.response && error.response.data) {
    const errors = error.response.data;

    // حالة لو فيه key واحد اسمه error (string)
    if (errors.error) {
      toast.error(errors.error);
      return;
    }

    // حالة لو جاي object زي { email: ["..."], password: ["..."] }
    if (typeof errors === "object") {
      Object.keys(errors).forEach((field) => {
        const messages = errors[field];
        if (Array.isArray(messages)) {
          messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error(messages); // لو كان string مش array
        }
      });
    } else {
      // fallback لو الرسالة جت string مباشرة
      toast.error(errors);
    }

  } else {
    toast.error("Something went wrong");
  }
});
  
  };

  return (
    <div className='w-screen h-screen grid md:grid-cols-2 gap-2'>
      <div className='flex justify-between items-start'>
        <div className='flex flex-col mt-[10%] ml-[8%]'>

          <span className='text-2xl lg:text-5xl text-one font-medium'>Welcome back</span>
          <div className='flex items-center text-[24px] lg:text-[80px] pt-5 text-one'>
            <button onClick={() => navigate('/')}>
              <img src={Voologo} alt="logo" />
            </button>
          </div>
          <span className='text-[16px] lg:text-[24px] mt-1'>Log in to your account</span>

          {/* Email */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-[300px] md:w-[450px] h-[72px] border-one border rounded-[8px] mt-2 lg:mt-5 pl-3'
            placeholder='Email'
          />

          {/* Password */}
          <div className='relative mt-2'>
            <input
              type={showPassword ? 'text' : 'password'}
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
              {/* {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />} */}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className='w-[300px] md:w-[450px] h-[72px] bg-one rounded-[8px] mt-5 text-white font-medium transition transform hover:scale-90'
          >
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
