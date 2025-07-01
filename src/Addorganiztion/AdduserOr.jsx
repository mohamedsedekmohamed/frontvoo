import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll';
import InputField from '../ui/InputField';
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Inputfiltter from '../ui/Inputfiltter';
import InputfiltterOr from '../ui/InputfiltterOr';
import InputArrowOr from '../ui/InputArrowOr';


const AdduserOr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setbirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setgender] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [id, setid] = useState('');



  useEffect(() => {
const {sendData} =location.state||{};
if(sendData){
  setid(sendData);
      setEdit(true);
            const token = localStorage.getItem('token');

         axios.get("https://backndVoo.voo-hub.com/api/ornization/users", {
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
          }
        })
        .catch(error => {
          console.error("Error fetching user:", error);
        });
    }
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'phone') setPhone(value);
    if (name === 'getCountry') setCountry(value);
    if (name === 'getCity') setCity(value);
    if (name === 'gender') setgender(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };
  

  
  const validateForm = () => {  

    let formErrors = {};
    if (!name) formErrors.name = t('NameRequired');
    if (!birthdate) formErrors.birthdate = t('BirthdateRequired');
    if (!phone) {
      formErrors.phone = t('PhoneRequired');
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = t('PhoneFormat');
    }
    if (!country) formErrors.country = t('CountryRequired');
    if (!city) formErrors.city = t('CityRequired');
    if (!gender) formErrors.gender = t('GenderRequired');
    if (!email.includes('@gmail.com')) formErrors.email = t('EmailInvalid');
    if (!edit && password.length < 8) {
      formErrors.password = t('PasswordTooShort');
    }

    Object.values(formErrors).forEach((error) => toast.error(error));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
   const newUser = {
      name,
      phone,
      country_id: country,
      city_id: city,
      gender,
      bithdate:birthdate,
      email,
    };

    if (!edit) {
      newUser.password = password;
    }

 if (edit) {
      axios.put(`https://backndVoo.voo-hub.com/api/ornization/user/update/${id}`, newUser, {
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
      return;
    }

    axios.post('https://backndVoo.voo-hub.com/api/ornization/user/add', newUser, {
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

      setbirthdate('');
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
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <ToastContainer />
      <AddAll name={edit ? t("EditUser") : t("AddUser")} navGo={-1} />

      <div className="flex flex-wrap gap-6 mt-6">
        <InputField placeholder={t("User")} name="name" value={name} onChange={handleChange} />
        <div className='flex flex-col gap-3 items-start justify-end'>
          <span className='text-[12px] font-bold text-one md:text-[16px]'>{t("Birthdate")}</span>
          <div className='relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]'>
            <FaRegCalendarAlt className={`absolute top-1/2 transform -translate-y-1/2 text-one ${isArabic ?
              "left-3" : "right-3"} text-[20px]  cursor-pointer  z-10`} />
            <DatePicker
              selected={birthdate}
              onChange={handstartDate}
              placeholderText={t("SelectDate")}
              dateFormat="yyyy-MM-dd"
              className="w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
        </div>

        <InputField placeholder={t("Phone")} name="phone" value={phone} onChange={handleChange} />
        <InputField placeholder={t("Email")} name="email" value={email} onChange={handleChange} />
        <Inputfiltter placeholder={t("Gender")} name="gender" value={gender} onChange={handleChange} />
        <InputArrowOr placeholder={t("Country")} name="getCountry" value={country} onChange={handleChange} required />
        <InputfiltterOr placeholder={t("City")} name="getCity" value={city} onChange={handleChange} shara={country} />
        <InputField placeholder={t("Password")} name="password" value={password} onChange={handleChange} />
      </div>

      <div className="flex mt-6">
        <button
          className='transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl'
          onClick={handleSave}
        >
          {t("Done")}
        </button>
      </div>
    </div>
  );
};

export default AdduserOr;