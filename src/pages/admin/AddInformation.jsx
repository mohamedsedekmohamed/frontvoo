import React, { useEffect, useState } from 'react';
import AddAll from '../../ui/AddAll'
import InputField from '../../ui/InputField'
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUploadButton from '../../ui/FileUploadButton';

const AddInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
    const [flag, setFlag] = useState(null);
    const [checkflag, setcheckFlag] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    password: ''
  });
  const handleFileChange = (file) => {
    if (file) setFlag(file);
  };
  useEffect(() => {
  
      const token = localStorage.getItem('token');
      axios.get("https://backndVoo.voo-hub.com/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const user = response.data.user
            setName(user.name || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
            setPassword(user.password||'')  
            setFlag(user.avatar_image_link||"")
            setcheckFlag(user.avatar_image_link||"")
        })
        .catch(error => {
          console.error("Error fetching user:", error);
        });
  
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required';
    if (!phone) {
      formErrors.phone = 'Phone is required';
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = 'Phone should contain only numbers or start with a "+"';
    }
    if (!email.includes('@gmail.com')) formErrors.email = 'Email should contain @gmail.com';
    if (password && password.length < 8) {
        formErrors.password = 'Password must be at least 8 characters';
      }
    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }


    const token = localStorage.getItem('token');
    const newUser = {
      name,
      phone,
      email,
    };
if(checkflag!==flag)newUser.avatar_image=flag
   if(password )newUser.password=password
      axios.post(`https://backndVoo.voo-hub.com/api/admin/profile_update`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('Admin updated successfully');
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        })
         .catch((error) => {
        const errors = error?.response?.data;
      
        if (errors && typeof errors === 'object') {
          const firstKey = Object.keys(errors)[0]; 
          const firstMessage = errors[firstKey]?.[0];
      
          if (firstMessage) {
            toast.error(firstMessage);
          } else {
            toast.error("Something went wrong.");
          }
        } else {
          toast.error("Something went wrong.");
        }
      });
   

    setName('');
    setPhone('');
    setFlag(null);
    setEmail('');
    setPassword('');
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-one animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-b-transparent border-three animate-spin-reverse"></div>
        <div className="absolute inset-6 rounded-full bg-one opacity-40"></div>
      </div>
    </div>
    );
  }

  return (
    <div>
      <ToastContainer/>
      <AddAll name={ "Edit Admin"} navGo={-1} />

      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="User"
          name="name"
          value={name}
          onChange={handleChange}
        />

        <InputField
          placeholder="Phone"
          name="phone"
          value={phone}
          onChange={handleChange}
        />
        <InputField
          placeholder="Gmail"
          name="email"
          value={email}
          onChange={handleChange}
        />
          <FileUploadButton
           name="flag"
           kind="flag"
           flag={flag}
           onFileChange={handleFileChange}
        />
        
          <InputField
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
      </div>

      <div className="flex mt-6">
        <button className='transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  );
};



export default AddInformation