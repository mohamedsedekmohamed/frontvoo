import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll';
import InputField from '../ui/InputField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import InputArrowOr from '../ui/InputArrowOr';
import InputfiltterOr from '../ui/InputfiltterOr';
import SwitchButton from '../ui/SwitchButton';
import GetLocationLink from '../ui/GetLocationLink';
import AddBenefitsRequirements from '../ui/AddBenefitsRequirements';
import FileUploadButton from '../ui/FileUploadButton';
import { FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import MapPicker from '../ui/MapPicker'
import FourPointsMap from '../ui/FourPointsMap';

const Addeventsor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
      const [points, setPoints] = useState([]);
  
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
  // const [google, setgoogle] = useState('');
  // const [namegoogle, setnamegoogle] = useState('');
  const [description, setdescription] = useState('');
  const [image, setimage] = useState(null);
   const [originalFlag, setOriginalFlag] = useState(null);
  
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
        points:"",

  });
  
   const [google, setgoogle] = useState({
  lat: 31.200092, // الإسكندرية
lng: 29.918739
    });
     const updateLocation = (newLocation) => {
      setgoogle(newLocation);
    };
      const extractLatLng = (url) => {
    // استخراج الإحداثيات من الرابط باستخدام تعبير منتظم
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
  useEffect(() => {
    const { sendData } = location.state || {};

    if (sendData) {
      setid(sendData);
      setEdit(true);

      const token = localStorage.getItem('token');
      axios
        .get('https://backndVoo.voo-hub.com/api/ornization/event', {
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
                        setvalue(event.status|| "inactive")

            // const latLng = extractLatLng(event.google_maps_location);
            // setgoogle(latLng || ''); // هنا بنمرر الإحداثيات المستخرجة
            // setnamegoogle(event.google_maps_location || '');
              const url = event.google_maps_location;
                          setPoints(event.points || [])

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
            setdescription(event.description || '');
            setbenfit(
              event.event_benfits?.map((b) => ({ text: b.benfit, status: b.status })) || []
            );
            setrequirment(
              event.event_requirments?.map((r) => ({ text: r.requirment, status: r.status })) || []
            );
            setimage(event.image_link || null);
            setOriginalFlag(event.image_link || null)
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
      case 'getCountry':
        setCountry(value);
        break;
      case 'getCity':
        setCity(value);
        break;
      case 'getZone':
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
if(points.length !== 4) formErrors.points=' Should select 4 points'

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
    // if (!namegoogle || !namegoogle.includes('http'))
    //   formErrors.google = 'Google Maps link is required and must be valid';
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
      points,
      end_time: end,
      number_of_volunteers: parseInt(volunteers),
      number_of_organizers: parseInt(organizers),
      location: locat,
      google_maps_location:`https://maps.google.com/?q=${google.lat},${google.lng}`,
      description,
      status: value,
      benfit: benfit.map((item) => ({ benfit: item.text, status: item.status })),
      requirment: requirment.map((item) => ({ requirment: item.text, status: item.status })),
    };
if (image !== originalFlag) {
      eventData.image = image;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (edit) {
      axios
        .put(`https://backndVoo.voo-hub.com/api/ornization/event/update/${id}`, eventData, { headers })
        .then(() => {
          toast.success( t('EventUpdated'));
          setTimeout(() => navigate(-1), 2000);
        })
        .catch(() => toast.error(t("NetworkFailed")));
    } else {
      axios
        .post('https://backndVoo.voo-hub.com/api/ornization/event/add', eventData, { headers })
        .then(() => {
          toast.success(t('EventAdded'));
          setTimeout(() => navigate(-1), 2000);
        })
      .catch(() => toast.error(t('NetworkFailed')));
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
setgoogle({
  lat: 30.033333,
  lng: 31.233334,
});

    setimage(null);
    setPoints([])
    setdescription('');
    setCountry('');
    setCity('');
    setvalue('inactive');
    setzone('');
    setbenfit([]);
    setrequirment([]);
    setEdit(false);
    setid('')
    setOriginalFlag(null)
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
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <AddAll name={edit ? t("EditEvent") : t("AddEvent")} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">{t("Information")}</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
              placeholder={t("Event")}
              name="Event"
              value={name}
              onChange={handleChange}
            />
            <InputField
              placeholder={t("volunteers")}
              name="volunteers"
              value={volunteers}
              onChange={handleChange}
              email="number"
            />
            <InputField
              placeholder={t("organizers")}
              name="organizers"
              value={organizers}
              onChange={handleChange}
              email="number"
            />
            <FileUploadButton name="image" kind={t("image")} flag={image} onFileChange={handleFileChange} />
            <InputField
              placeholder={t("location")}
              name="Location"
              value={locat}
              onChange={handleChange}
            />
            <InputField
              placeholder={t("description")}
              name="description"
              value={description}
              onChange={handleChange}
              />
          </div>
        </div>
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">{t("place")} </span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputArrowOr
              placeholder={t("Country")}
              name="getCountry"
              value={country}
              onChange={handleChange}
            />
            <InputfiltterOr
              placeholder={t("City")}
              name="getCity"
              value={city}
              onChange={handleChange}
              shara={country}
            />
            <InputfiltterOr
              placeholder={t("Zone")}
              name="getZone"
              value={zone}
              onChange={handleChange}
              shara={city}
            />
          </div>
        </div>

        <div className=" flex flex-col   ">
          <span className="text-3xl font-bold text-three ">   {t("Date_Time")}</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">{t("date")}</span>
              <div className="relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]">
                <FaRegCalendarAlt className="absolute top-1/2 right-4 transform -translate-y-1/2 text-one z-10" />
                <DatePicker
                    minDate={new Date()} // يمنع اختيار أي تاريخ قبل النهارده
                  selected={date}
                  onChange={handstartDate}
                  placeholderText={t("SelectDate")}
                  dateFormat="yyyy-MM-dd"
                  className=" w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]"> {t("start")} </span>
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
              <span className="text-[12px] font-bold text-one md:text-[16px]">{t("end")} </span>
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
      <div className=" flex flex-col my-3 mt-20 ">
        <span className="text-3xl font-bold text-three ">{t("Zone")}</span>
         <div className="flex flex-wrap justify-center gap-6 mt-6 bg-eight p-5">
        {/* <GetLocationLink
            google={google} // تمرير الإحداثيات هنا
            setnamegoogle={setnamegoogle}
            onLocationChange={(location) => setgoogle(location)}
          /> */}
          <MapPicker location={google} onLocationChange={updateLocation} />
                          </div>

      </div>
      <div className=" flex flex-col my-3 ">
        <span className="text-3xl font-bold text-three ">{t("benfitAndrequirment")}</span>
        <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
          <AddBenefitsRequirements
            benfit={benfit}
            setbenfit={setbenfit}
            requirment={requirment}
            setrequirment={setrequirment}
          />
        </div>
      </div>
  <div className='my-5'>
      <SwitchButton value={value} setValue={setvalue} />
      </div>
      <FourPointsMap points={points} setPoints={setPoints} />
            <div className="flex mt-6">
        <button
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl"
          onClick={handleSave}
        >
          {t("Done")}
          </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Addeventsor
