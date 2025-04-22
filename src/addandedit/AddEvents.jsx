import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import InputArrow from '../ui/InputArrow';
import SwitchButton from '../ui/SwitchButton';
import Inputfiltter from '../ui/Inputfiltter'
import GetLocationLink from '../ui/GetLocationLink'
const AddEvents = () => {
   const navigate = useNavigate();
    const location = useLocation()
     const [id, setid] = useState('');
      const [country, setCountry] = useState('');
      const [zone, setzone] = useState('');
      const [name, setName] = useState('');
        const [date, setDate] = useState('');
      const [start,setStart]=useState('');
      const[end,setEnd]=useState('')
      const[volunteers,setvolunteers]=useState('')
      const[organizers,setorganizers]=useState('')
      const[locat,setlocat]=useState('')
      const[google,setgoogle]=useState('')
      const[description,setdescription]=useState('')
      const[image,setimage]=useState(null)
      const[value,setvalue]=useState(null)
        const [city, setCity] = useState('');
          const [edit, setEdit] = useState(false);
          const [benfit, setbenfit] = useState([]);
          const [requirment, setrequirment] = useState([]);
          const [loading, setLoading] = useState(true);
        
        const [errors, setErrors] = useState({
          volunteers:"",
          locat:"",
          organizers:"",
          start:"",
          end:"",
          name: '',
          description: '',
          country: '',
          city: '',
          zone: '',
          gender: '',
          birthdate: '',
          benfit: '',
          requirment: '',
        });
        useEffect(() => {
          const { sendData } = location.state || {};
          if (sendData) {
            setid(sendData); 
            setEdit(true);
        
            const token = localStorage.getItem('token');
            axios.get("https://backndVoo.voo-hub.com/api/admin/event", {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
              .then(response => {
                const event = response.data.events.find(e => e.id === sendData);
                if (event) {
                  setName(event.name || '');
                  setCountry(event.country_id || '');
                  setCity(event.city_id || '');
                  setzone(event.zone_id || '');
                  setDate(event.date || '');
                  setStart(event.start_time || '');
                  setEnd(event.end_time || '');
                  setvolunteers(event.number_of_volunteers || '');
                  setorganizers(event.number_of_organizers || '');
                  setlocat(event.location || '');
                  setgoogle(event.google_maps_location || '');
                  setdescription(event.description || '');
                  setbenfit(event.event_benfits?.map(b => b.benfit) || []);
                  setrequirment(event.event_requirments?.map(r => r.requirment) || []);
                  setimage(event.image_link || null);
                }
              })
              .catch(error => {
                console.error("Error fetching event:", error);
              });
          }
        
          const timeout = setTimeout(() => {
            setLoading(false);
          }, 1000);
        
          return () => clearTimeout(timeout);
        }, [location.state]);
        
        const handleChange = (e) => {
          const { name, value } = e.target;
        
          switch (name) {
            case 'name':
              setName(value);
              break;
            case 'country':
              setCountry(value);
              break;
            case 'city':
              setCity(value);
              break;
            case 'zone':
              setzone(value);
              break;
            case 'date':
              setDate(value);
              break;
            case 'start':
              setStart(value);
              break;
            case 'end':
              setEnd(value);
              break;
            case 'volunteers':
              setvolunteers(value);
              break;
            case 'organizers':
              setorganizers(value);
              break;
            case 'locat':
              setlocat(value);
              break;
            case 'google':
              setgoogle(value);
              break;
            case 'description':
              setdescription(value);
              break;
            default:
              break;
          }
        };
        
        const validateForm = () => {
          let formErrors = {};
        
          if (!name) formErrors.name = 'Event name is required';
          if (!date) formErrors.date = 'Event date is required';
          if (!start) formErrors.start = 'Start time is required';
          if (!end) formErrors.end = 'End time is required';
        
          if (!volunteers) {
            formErrors.volunteers = 'Number of volunteers is required';
          } else if (isNaN(volunteers) || volunteers <= 0) {
            formErrors.volunteers = 'Volunteers must be a positive number';
          }
        
          if (!organizers) {
            formErrors.organizers = 'Number of organizers is required';
          } else if (isNaN(organizers) || organizers <= 0) {
            formErrors.organizers = 'Organizers must be a positive number';
          }
        
          if (!locat) formErrors.locat = 'Location is required';
          if (!google || !google.includes('http')) formErrors.google = 'Google Maps link is required and must be valid';
          if (!description) formErrors.description = 'Description is required';
        
          if (!country) formErrors.country = 'Country is required';
          if (!city) formErrors.city = 'City is required';
          if (!zone) formErrors.zone = 'Zone is required';
        
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
          const eventData = {
            country_id: country,
            city_id: city,
            zone_id: zone,
            name,
            date,
            start_time: start,
            end_time: end,
            number_of_volunteers: parseInt(volunteers),
            number_of_organizers: parseInt(organizers),
            location: locat,
            google_maps_location: google,
            description,
            image: "no image",
            status: "active",
            benfit: benfit.map(b => ({ benfit: b, status: "active" })),
            requirment: requirment.map(r => ({ requirment: r, status: "active" })),
          };
        
          const headers = {
            Authorization: `Bearer ${token}`,
          };
        
          if (edit) {
            axios.put(`https://backndVoo.voo-hub.com/api/admin/event/update/${id}`, eventData, { headers })
              .then(() => {
                toast.success('Event updated successfully');
                setTimeout(() => navigate(-1), 2000);
              })
              .catch(() => toast.error('Failed to update event'));
          } else {
            axios.post('https://backndVoo.voo-hub.com/api/admin/event/add', eventData, { headers })
              .then(() => {
                toast.success('Event added successfully');
                setTimeout(() => navigate(-1), 2000);
              })
              .catch(() => toast.error('Failed to add event'));
          }
        
          // Reset form
          setName('');
          setDate('');
          setStart('');
          setEnd('');
          setvolunteers('');
          setorganizers('');
          setlocat('');
          setgoogle('');
          setdescription('');
          setCountry('');
          setCity('');
          setzone('');
          setbenfit([]);
          setrequirment([]);
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
  return (
    <div>
<AddAll name="Add Events" navGo={-1}/>
<div className="flex flex-wrap gap-6 mt-6">
    <InputField/>
    <InputField/>
    <InputField/>
    <InputField/>
</div>
    </div>
  )
}

export default AddEvents
