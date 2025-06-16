import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import InputArrow from '../ui/InputArrow';
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SwitchButton from '../ui/SwitchButton'
import Inputfiltter from '../ui/Inputfiltter';

const AddUser = () => {
  const navigate = useNavigate();
    const [status, setStatus] = useState('inactive');

  const location = useLocation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setid] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setbirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setgender] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    country: '',
    city: '',
    gender: '',
    birthdate: '',
    email: '',
    password: ''
  });
  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      console.log(sendData); 
      setid(sendData); 
      setEdit(true);
  
      const token = localStorage.getItem('token');
      axios.get("https://backndVoo.voo-hub.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const user = response.data.users.find(u => u.id === sendData);
          console.log(user);
          if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setCountry(user.country_id || '');
            setCity(user.city_id || '');
            setgender(user.gender || '');
            setEmail(user.email || '');
            setbirthdate(user.birth||'');
            setStatus(user.account_status||'');
          }
        })
        .catch(error => {
          console.error("Error fetching user:", error);
        });
    }
  
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value);
    if (name === 'country') setCountry(value);
    if (name === 'city') setCity(value);
    if (name === 'gender') setgender(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required';
    if (!birthdate) formErrors.birthdate = 'Birthdate is required';
    if (!phone) {
      formErrors.phone = 'Phone is required';
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = 'Phone should contain only numbers or start with a "+"';
    }
    if (!country) formErrors.country = 'Country is required';
    if (!city) formErrors.city = 'City is required';
    if (!gender) formErrors.gender = 'Gender is required';
    if (!email.includes('@gmail.com')) formErrors.email = 'Email should contain @gmail.com';
    if (!edit && password.length < 8) {
      formErrors.password = 'Password must be at least 6 characters';
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
      country_id: country,
      city_id: city,
      gender,
      bithdate:birthdate,
      email,
      account_status:status
    };

    if (!edit) {
      newUser.password = password;
    }

    if (edit) {
      axios.put(`https://backndVoo.voo-hub.com/api/admin/user/update/${id}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('User updated successfully');
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        })
        .catch(() => {
          toast.error("Failed network");
        });
      return;
    }

    axios.post('https://backndVoo.voo-hub.com/api/admin/user/add', newUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success('User added successfully');
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      })
      .catch(() => {
        toast.error("Failed network");
      });

    setbirthdate('');
    setStatus("inactive")
    setName('');
    setPhone('');
    setCountry('');
    setCity('');
    setgender('');
    setEmail('');
    setPassword('');
    setEdit(false);
  };

  const handstartDate = (newData) => {
    if (newData) {
      const formatted = newData.toISOString().split('T')[0]; 
      setbirthdate(formatted);
        } else {
      setbirthdate("");
    }
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
      <AddAll name={edit ? "Edit user" : "Add user"} navGo={-1} />

      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="User"
          name="name"
          value={name}
          onChange={handleChange}
        />

<div className='flex flex-col gap-3 items-start justify-end'>
  <span className='text-[12px] font-bold text-one md:text-[16px]'>Birthdate</span>

  <div className='relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]'>
    <FaRegCalendarAlt className="absolute top-1/2 right-4 transform -translate-y-1/2 text-one z-10" />

    <DatePicker
      selected={birthdate}
      onChange={handstartDate}
      placeholderText="Select date"
      dateFormat="yyyy-MM-dd"
      className=" w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
    />
  </div>
</div>
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
        <Inputfiltter
          placeholder="gender"
          name="gender"
          value={gender}
          onChange={handleChange}
        />
        <InputArrow
          placeholder="Country"
          name="country"
          value={country}
          onChange={handleChange}
          required
        />
            <Inputfiltter 
              placeholder="city"
              name="city"
              value={city}
              onChange={handleChange}
              shara={country}
            />
          <InputField
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
      <div className='flex justify-center items-end'>
              <SwitchButton value={status} title='status' setValue={setStatus} />
      </div>
      </div>


      <div className="flex mt-6">
        <button className='transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AddUser;
