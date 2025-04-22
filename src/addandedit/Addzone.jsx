import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import InputArrow from '../ui/InputArrow';
import Inputfiltter from '../ui/Inputfiltter'
const Addzone = () => {
   const navigate = useNavigate();
      const location = useLocation();
      const [id, setid] = useState('');
      const [country, setCountry] = useState('');
      const [city, setCity] = useState('');
      const [zone, setZone] = useState('');
      const [edit, setEdit] = useState(false);
      const [loading, setLoading] = useState(true);
    
      const [errors, setErrors] = useState({
        country: '',
        city: ''  ,
        zone:''
      });

      useEffect(() => {
        const { sendData } = location.state || {};
        if (sendData) {
          setid(sendData); 
          setEdit(true);
        
          const token = localStorage.getItem('token');
          axios.get("https://backndVoo.voo-hub.com/api/admin/zone", {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              const user = response.data[0].zones.find(u => u.id === sendData);
              if (user) {
                setCountry(user.country_id|| '');
                setCity(user.city_id || '');
                setZone(user.name || '');   
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

          const handleChange = (e) => {
            const { name, value } = e.target;
            if (name === 'country') setCountry(value);
            if (name === 'city') setCity(value);
            if (name === 'zone') setZone(value);
          };
          const handleSave = () => {
            if (!validateForm()) {
              return;
            }
        
            const token = localStorage.getItem('token');
            const newUser = {
              name: zone,
              country_id:country,
              city_id	:city
            };
        
           
        
            if (edit) {
              axios.put(`https://backndVoo.voo-hub.com/api/admin/zone/update/${id}`, newUser, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then(() => {
                  toast.success('zone updated successfully');
                  setTimeout(() => {
                    navigate(-1);
                  }, 1500);
                })
                .catch(() => {
                  toast.error("Failed network");
                });
              return;
            }
        
            axios.post('https://backndVoo.voo-hub.com/api/admin/zone/add', newUser, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then(() => {
                toast.success('zone added successfully');
                setTimeout(() => {
                  navigate(-1);
                }, 1500);
              })
              .catch(() => {
                toast.error("Failed network");
              });
      setCity('')
            setCountry('');
            setZone('');
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
              <AddAll name={edit ? "Edit zone" : "Add zone"} navGo={-1} />
              <div className="flex flex-wrap gap-6 mt-6">
                <InputField
                  placeholder="zone"
                  name="zone"
                  value={zone}
                  onChange={handleChange}
                />
               
               <InputArrow 
              placeholder="Countries"
              name="country"
              value={country}
              onChange={handleChange}
            />
               <Inputfiltter 
              placeholder="city"
              name="city"
              value={city}
              onChange={handleChange}
              shara={country}
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
export default Addzone
