import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import MultiSelectDropdown from '../ui/MultiSelectDropdown'
const AddNotification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [edit, setEdit] = useState(false);
     const [loading, setLoading] = useState(true);
     const[notification,setNotification]=useState("")
     const[users,setUsers]=useState([])
       const [errors, setErrors] = useState({
         notification: '',
       });

        useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      setEdit(true);
  
      const token = localStorage.getItem('token');
      axios.get(`https://backndVoo.voo-hub.com/api/admin/notification/item/${sendData}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
       .then(response => {
  const notif = response.data.notification;
  setNotification(notif.notification);
  setUsers((notif.users || []).map(user => user.id)); 
})

     
    }
  
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notification') setNotification(value);
  };
    const validateForm = () => {
      let formErrors = {};
    
      if (!users) formErrors.users = 'users is required';
      if (!notification ) formErrors.notification = 'notification is required';
  
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
   

    const newUseer = {
notification,
users
    };
    if(newUseer){
      console.log(newUseer)
    }

 
    if (edit) {
          const { sendData } = location.state || {};

      axios.post(`https://backndVoo.voo-hub.com/api/admin/notification/update/${sendData}`,newUseer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          toast.success('notification updated successfully');
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        })
        .catch(() => {
          toast.error("Failed network");
        });
      return;
    }
   

    axios.post('https://backndVoo.voo-hub.com/api/admin/notification/add', newUseer, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success('notification added successfully');
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      })
      .catch(() => {
        toast.error("Failed network");
      });

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
      <AddAll name={edit ? "Edit Notification" : "Add Notification"} navGo={-1} />
       <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="Notification"
          name="notification"
          value={notification}
          onChange={handleChange}
        />

<MultiSelectDropdown
  placeholder="Users"
  name="notification"
  selectedValues={users}
  onChange={setUsers}
/>

      </div>

      <div className="flex mt-6">
        <button className='w-[300px] text-[32px] text-white
         transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
          Done
        </button>
      </div>
    </div>
  )
}

export default AddNotification