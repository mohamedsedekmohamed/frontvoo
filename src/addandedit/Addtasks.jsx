import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll';
import InputField from '../ui/InputField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import InputArrow from '../ui/InputArrow';
import SwitchButton from '../ui/SwitchButton';
import Inputfiltter from '../ui/Inputfiltter';
import AddBenefitsRequirements from '../ui/AddBenefitsRequirements';
import FileUploadButton from '../ui/FileUploadButton';
import { FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MapPicker from '../ui/MapPicker'

const Addtasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setid] = useState('');
  const [tozone, settozone] = useState('');
  const [fromzone, setfromzone] = useState('');
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [volunteers, setvolunteers] = useState('');
  const [image, setimage] = useState(null);
  const [imagetwo, setimagetwo] = useState(null);
  const [value, setvalue] = useState('inactive');
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [orgnization, setorgnization] = useState('');
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useState(true);
   const [google, setgoogle] = useState({
     lat: 31.200092, // الإسكندرية
  lng: 29.918739
      });
      const updateLocation = (newLocation) => {
        setgoogle(newLocation);
      };
           const extractLatLng = (url) => {
    const regex = /q=([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
    const matches = url.match(regex);

    if (matches) {
      const lat = parseFloat(matches[1]);
      const lng = parseFloat(matches[2]);
      return { lat, lng };
    } else {
      return null; // في حالة عدم وجود الإحداثيات في الرابط
    }
  };
  const [errors, setErrors] = useState({
    volunteers: '',
    organizers: '',
    start: '',
    name: '',
    description: '',
    tozone: '',
    fromzone: '',
    google: '',
    birthdate: '',
  });
  useEffect(() => {
    const { sendData } = location.state || {};

    if (sendData) {
      setid(sendData);
      setEdit(true);

      const token = localStorage.getItem('token');
      axios
        .get('https://backndVoo.voo-hub.com/api/admin/task', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const event = response.data.tasks.find((e) => e.id === sendData);
          if (event) {
            setName(event.name || '');
            // console.log(event.to_zone?.name)
            // console.log(event.from_zone?.name )
            settozone(event.to_zone?.id || '');
            setfromzone(event.from_zone?.id || '');

            setDate(event.date || '');
            setStart(event.start_time || '');
            setvolunteers(event.number_of_voo_needed || '');
            setdescription(event.description || '');
            setimage(event.image_link || null);
            setimagetwo(event.image_link || null);
            setvalue(event.status || "")
            setorgnization(event.orgnization_id || "")
            const url = event.google_maps_location;
const locatio = extractLatLng(url);

if (locatio) {
  console.log(`Latitude: ${locatio.lat}, Longitude: ${locatio.lng}`);
} else {
  console.log("لم يتم العثور على الإحداثيات في الرابط.");
}
      setgoogle({ 
        lat: locatio.lat, 
    lng: locatio.lng,
  })
          }
        })
        .catch((error) => {
          console.error('Error fetching event:', error);
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.state]);
  const handleFileChange = (file) => {
    if (file) setimage(file);
  };
  const handlechangetwo = (e) => {
    const { name, value } = e.target;
    if (name === "zone") settozone(value)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'Task':
        setName(value);
        break;
      case 'zone':
        setfromzone(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'start':
        setStart(value);
        break;
      case 'volunteers':
        setvolunteers(value);
        break;
      case 'description':
        setdescription(value);
        break;
      case 'organization':
        setorgnization(value);
        break;
      default:
        break;
    }
  };
  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = 'Task name is required';
    if (!google) formErrors.google = 'Loaction is required';
    if (!tozone) formErrors.tozone = ' to Zone is required';
    if (!fromzone) formErrors.fromzone = ' from Zone is required';
    if (!date) formErrors.date = 'Event date is required';
    if (!start) formErrors.start = 'Start time is required';
    if (!volunteers) {
      formErrors.volunteers = 'Number of volunteers is required';
    } else if (isNaN(volunteers) || volunteers <= 0) {
      formErrors.volunteers = 'Volunteers must be a positive number';
    }
    if (!description) formErrors.description = 'Description is required';
    if (!image && !edit) formErrors.image = "image is required"

    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handstartDate = (newData) => {
    if (newData) {
     const year = newData.getFullYear();
    const month = String(newData.getMonth() + 1).padStart(2, '0');
    const day = String(newData.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    } else {
      setDate('');
    }
  };

  const handStartTime = (newTime) => {
    if (newTime) {
      const formattedTime = newTime;
      setStart(formattedTime);
    } else {
      setStart(''); // في حالة حذف الوقت
    }
  }

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    const eventData = {
      name,
      date,
      from_zone_id:fromzone,
      to_zone_id:tozone,
      start_time: start,
      number_of_voo_needed: parseInt(volunteers),
      description,
      status: value,
      orgnization_id:orgnization,
        google_map_location:`https://maps.google.com/?q=${google.lat},${google.lng}`,

         };
if(imagetwo!==image)
  {
    eventData.image = image;
  }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (edit) {
      axios
        .put(`https://backndVoo.voo-hub.com/api/admin/task/update/${id}`, eventData, { headers })
        .then(() => {
          toast.success('Task updated successfully');
          setTimeout(() => navigate(-1), 2000);
            setName('');
    setDate('');
    setStart('');
    setvolunteers('');
    setorgnization('');
    setimage(null);
    setimagetwo(null)
    setdescription('');
    setvalue('inactive');
    settozone('');
    setfromzone('');
    setEdit(false);
    setid('')
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
    });    } else {
      axios
        .post('https://backndVoo.voo-hub.com/api/admin/task/add', eventData, { headers })
        .then(() => {
          toast.success('Task added successfully');
          setTimeout(() => navigate(-1), 2000);
             setName('');
    setDate('');
    setStart('');
    setvolunteers('');
    setorgnization('');
    setimage(null);
    setimagetwo(null)
    setdescription('');
    setvalue('inactive');
    settozone('');
    setfromzone('');
    setEdit(false);
    setid('')
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
    });    }

  
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
      <AddAll name={edit ? 'Edit Task' : 'Add Task'} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">Information</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
              placeholder="Task"
              name="Task"
              value={name}
              onChange={handleChange}
            />
            <InputField
              placeholder="description"
              name="description"
              value={description}
              onChange={handleChange}
            />
            <InputArrow
              placeholder="organizers"
              name="organization"
              value={orgnization}
              onChange={handleChange}
            />
          </div>
        </div>
    
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">place and time</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputArrow
              placeholder="From zone"
              name="zone"
              value={fromzone}
              onChange={handleChange}
            />
            <InputArrow
              placeholder="To zone"
              name="zone"
              value={tozone}
              onChange={handlechangetwo}
            />
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">Date</span>
              <div className="relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]">
                <FaRegCalendarAlt className="absolute top-1/2 right-4 transform -translate-y-1/2 text-one z-10" />
                <DatePicker
                  selected={date}
                  onChange={handstartDate}
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  className=" w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
                  showYearDropdown
                  scrollableYearDropdown
                  minDate={new Date()} // يمنع اختيار أي تاريخ قبل النهارده
                  yearDropdownItemNumber={100}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">start Time </span>
              <div className=" flex  justify-between items-center w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven   ">
                <TimePicker
                  className={`w-full h-full `}
                  onChange={handStartTime}
                  value={start}
                  format="HH:mm"
                  disableClock={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">volunteers</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
              placeholder="number of volunteers  "
              name="volunteers"
              value={volunteers}
              onChange={handleChange}
              email="number"
            />


            <FileUploadButton name="image" kind="image" flag={image} onFileChange={handleFileChange} />

          </div>
        </div>
        
        <SwitchButton value={value} setValue={setvalue} />

        </div>
               <div className=" flex flex-col my-15">
        <span className="text-3xl font-bold text-three my-5 ">Location</span>
        <div className="flex flex-wrap justify-center gap-6 mt-6 bg-eight p-5">
       
          <MapPicker location={google} onLocationChange={updateLocation} />
                  </div>
      </div>
        <div className="flex mt-6">
          <button
            className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl"
            onClick={handleSave}
          >
            Done
          </button>
      </div>
    </div>
  )
}
export default Addtasks
