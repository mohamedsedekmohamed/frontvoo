import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import InputArrow from '../ui/InputArrow';
const Addcity = () => {
   const navigate = useNavigate();
    const location = useLocation();
    const [id, setid] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
  
    const [errors, setErrors] = useState({
      
      country: '',
      city: ''  
    });
    useEffect(() => {
      const { sendData } = location.state || {};
      if (sendData) {
        console.log(sendData); 
        setid(sendData); 
        setEdit(true);
    
        const token = localStorage.getItem('token');
        axios.get("https://backndVoo.voo-hub.com/api/admin/city", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            const user = response.data.cities.find(u => u.id === sendData);
            if (user) {
              setCountry(user.country_id || '');
              setCity(user.name || '');
            
            }
          })
          .catch(error => {
            toast.error("Error fetching city:", error);
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
      if (name === 'city') setCity(value);
    };
    const validateForm = () => {
      let formErrors = {};
  
    
      if (!country) formErrors.country = 'Country is required';
      if (!city) formErrors.city = 'city is required';
  
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
        name: city,
        country_id:country
      };
  
     
  
      if (edit) {
        axios.put(`https://backndVoo.voo-hub.com/api/admin/city/update/${id}`, newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            toast.success('city updated successfully');
            setTimeout(() => {
              navigate(-1);
            }, 1500);
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
         })
        return;
      }
  
      axios.post('https://backndVoo.voo-hub.com/api/admin/city/add', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('city added successfully');
          setTimeout(() => {
            navigate(-1);
          }, 1500);
          setCity('')
      setCountry('');
      setid('');
      setEdit(false);
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
        <AddAll name={edit ? "Edit city" : "Add city"} navGo={-1} />
        <div className="flex flex-wrap gap-6 mt-6">
          <InputField
            placeholder="city"
            name="city"
            value={city}
            onChange={handleChange}
          />
         
         <InputArrow 
        placeholder="Countries"
        name="country"
        value={country}
        onChange={handleChange}
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
}


export default Addcity
