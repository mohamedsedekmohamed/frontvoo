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
import GetLocationLink from '../ui/GetLocationLink';
import AddBenefitsRequirements from '../ui/AddBenefitsRequirements';
import FileUploadButton from '../ui/FileUploadButton';
import { FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setid] = useState('');
  const [country, setCountry] = useState('');
  const [zone, setzone] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [volunteers, setvolunteers] = useState('');
  const [organizers, setorganizers] = useState('');
  const [locat, setlocat] = useState('');
  const [google, setgoogle] = useState('');
  const [namegoogle, setnamegoogle] = useState('');
  const [description, setdescription] = useState('');
  const [image, setimage] = useState(null);
    const [imagetwo, setimagetwo] = useState(null);
  const [value, setvalue] = useState('inactive');
  const [city, setCity] = useState('');
  const [edit, setEdit] = useState(false);
  const [benfit, setbenfit] = useState([]);
  const [requirment, setrequirment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    volunteers: '',
    locat: '',
    organizers: '',
    start: '',
    end: '',
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
  function extractLatLng(url) {
    if (!url) return null;
  
    try {
      const decodedUrl = decodeURIComponent(url);
      const match = decodedUrl.match(/q=([-.\d\s]+)[,;]([-.\d\s]+)/i);
      
      if (match) {
        const lat = parseFloat(match[1].trim());
        const lng = parseFloat(match[2].trim());
  
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    } catch (error) {
      console.error("Invalid URL format", error);
    }
  
    return null;
  }
  
  useEffect(() => {
    const { sendData } = location.state || {};

    if (sendData) {
      setid(sendData);
      setEdit(true);

      const token = localStorage.getItem('token');
      axios
        .get('https://backndVoo.voo-hub.com/api/admin/event', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const event = response.data.events.find((e) => e.id === sendData);
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
            const latLng = extractLatLng(event.google_maps_location);
            setgoogle(latLng || ''); // هنا بنمرر الإحداثيات المستخرجة
            setnamegoogle(event.google_maps_location || '');
            setdescription(event.description || '');
            setbenfit(
              event.event_benfits?.map((b) => ({ text: b.benfit, status: b.status })) || []
            );
            setrequirment(
              event.event_requirments?.map((r) => ({ text: r.requirment, status: r.status })) || []
            );
            setimage(event.image_link || null);
            setimagetwo(event.image_link || null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'Event':
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
      case 'Location':
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
    if (!country) formErrors.country = 'Country is required';
    if (!city) formErrors.city = 'City is required';
    if (!zone) formErrors.zone = 'Zone is required';

    if (!date) formErrors.date = 'Event date is required';
    if (!start) formErrors.start = 'Start time is required';
    if (!end) formErrors.end = 'End time is required';

    if (!volunteers) {
      formErrors.volunteers = 'Number of volunteers is required';
    } else if (isNaN(volunteers) || volunteers <= 0) {
      formErrors.volunteers = 'Volunteers must be a positive number';
    }
if(!image &&!edit)formErrors.image="image is required"
    if (!organizers) {
      formErrors.organizers = 'Number of organizers is required';
    } else if (isNaN(organizers) || organizers <= 0) {
      formErrors.organizers = 'Organizers must be a positive number';
    }

    if (!locat) formErrors.locat = 'Location is required';
    if (!namegoogle || !namegoogle.includes('http'))
      formErrors.google = 'Google Maps link is required and must be valid';
    if (!description) formErrors.description = 'Description is required';

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
      google_maps_location: namegoogle,
      description,
      status: value,
      benfit: benfit.map((item) => ({ benfit: item.text, status: item.status })),
      requirment: requirment.map((item) => ({ requirment: item.text, status: item.status })),
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
        .put(`https://backndVoo.voo-hub.com/api/admin/event/update/${id}`, eventData, { headers })
        .then(() => {
          toast.success('Event updated successfully');
          setTimeout(() => navigate(-1), 2000);
        })
        .catch(() => toast.error('Failed to update event'));
    } else {
      axios
        .post('https://backndVoo.voo-hub.com/api/admin/event/add', eventData, { headers })
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
    setgoogle('');
    setvolunteers('');
    setorganizers('');
    setlocat('');
    setgoogle('');
    setimage(null);
    setdescription('');
    setCountry('');
    setCity('');
    setvalue('inactive');
    setzone('');
    setbenfit([]);
    setrequirment([]);
    setEdit(false);
    setid('')
  };

  const handstartDate = (newData) => {
    if (newData) {
      const formatted = newData.toISOString().split('T')[0];
      setDate(formatted);
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
  };

  const handEndTime = (newTime) => {
    if (newTime) {
      setEnd(newTime);
    } else {
      setEnd('');
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
      <AddAll name={edit ? 'Edit Event' : 'Add Event'} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">Information</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
              placeholder="Event"
              name="Event"
              value={name}
              onChange={handleChange}
            />
            <InputField
              placeholder="volunteers "
              name="volunteers"
              value={volunteers}
              onChange={handleChange}
              email="number"
            />
            <InputField
              placeholder="organizers "
              name="organizers"
              value={organizers}
              onChange={handleChange}
              email="number"
            />
            <FileUploadButton name="image" kind="image" flag={image} onFileChange={handleFileChange} />
            <InputField
              placeholder="Location"
              name="Location"
              value={locat}
              onChange={handleChange}
            />
            <InputField
              placeholder="description"
              name="description"
              value={description}
              onChange={handleChange}
              />
          </div>
        </div>
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">Place</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputArrow
              placeholder="Country"
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
            <Inputfiltter
              placeholder="zone"
              name="zone"
              value={zone}
              onChange={handleChange}
              shara={city}
            />
          </div>
        </div>

        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">Date and Time</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">Date</span>
              <div className="relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]">
                <FaRegCalendarAlt className="absolute top-1/2 right-4 transform -translate-y-1/2 text-one z-10" />
                <DatePicker
                  selected={date}
                  onChange={handstartDate}
                  minDate={new Date()} // يمنع اختيار أي تاريخ قبل النهارده
                  placeholderText="Select date"
                  dateFormat="yyyy-MM-dd"
                  className=" w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
                  showYearDropdown
                  scrollableYearDropdown
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
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">end Time </span>
              <div className=" flex  justify-between items-center w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven   ">
                <TimePicker
                  className={`w-full h-full `}
                  onChange={handEndTime}
                  value={end}
                  format="HH:mm"
                  disableClock={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col my-3 ">
        <span className="text-3xl font-bold text-three ">Place</span>
        <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
        <GetLocationLink
            google={google} // تمرير الإحداثيات هنا
            setnamegoogle={setnamegoogle}
            onLocationChange={(location) => setgoogle(location)}
          />
                  </div>
      </div>
      <div className=" flex flex-col my-3 ">
        <span className="text-3xl font-bold text-three ">benfit And requirment</span>
        <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
          <AddBenefitsRequirements
            benfit={benfit}
            setbenfit={setbenfit}
            requirment={requirment}
            setrequirment={setrequirment}
          />
        </div>
      </div>
      <SwitchButton value={value} setValue={setvalue} />
      <div className="flex mt-6">
        <button
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl"
          onClick={handleSave}
        >
          Done
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEvents;