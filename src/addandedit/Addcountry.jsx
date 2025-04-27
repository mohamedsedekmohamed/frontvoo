import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUploadButton from '../ui/FileUploadButton';
const Addcountry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setid] = useState('');
  const [flag, setFlag] = useState(null);
  const [checkflag, setcheckFlag] = useState(null);
  const [country, setCountry] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    
    country: '',
    flag: ''  
  });
  
  const handleFileChange = (file) => {
    if (file) setFlag(file);
  };
  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      console.log(sendData); 
      setid(sendData); 
      setEdit(true);
  
      const token = localStorage.getItem('token');
      axios.get("https://backndVoo.voo-hub.com/api/admin/country", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const user = response.data.countries.find(u => u.id === sendData);
          console.log(user);
          if (user) {
            setCountry(user.name || '');
            setFlag(user.flag_link || '');
            setcheckFlag(user.flag_link || '');
          
          }
        })
        .catch(error => {
          toast.error("Error fetching country:", error);
        });
    }
  
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') setCountry(value);
  };

  const validateForm = () => {
    let formErrors = {};

  
    if (!country) formErrors.country = 'Country is required';
    if (!flag && !edit) formErrors.flag = 'Flag is required';

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
    const newUsers = {
      name: country,
    };

    if (flag !== checkflag) {
      newUser.flag = flag;
    }

    if (edit) {
      axios.put(`https://backndVoo.voo-hub.com/api/admin/country/update/${id}`, newUsers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('country updated successfully');
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        })
        .catch(() => {
          toast.error("Failed network");
        });
      return;
    }
    const newUser = {
      name: country,
      flag:flag
    };

    axios.post('https://backndVoo.voo-hub.com/api/admin/country/add', newUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success('country added successfully');
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      })
      .catch(() => {
        toast.error("Failed network");
      });
setFlag(null);
    setCountry('');
    setid('');
    setEdit(false);
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
      <AddAll name={edit ? "Edit country" : "Add country"} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="country"
          name="country"
          value={country}
          onChange={handleChange}
        />
        <FileUploadButton
           name="flag"
           kind="flag"
           flag={flag}
           onFileChange={handleFileChange}
        />
      </div>

      <div className="flex mt-6">
        <button className='w-[300px] text-[32px] text-white
         transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  );
};


export default Addcountry
