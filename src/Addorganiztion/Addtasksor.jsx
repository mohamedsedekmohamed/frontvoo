import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll';
import InputField from '../ui/InputField';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SwitchButton from '../ui/SwitchButton';
import AddBenefitOr from '../ui/AddBenefitOr';
import FileUploadButton from '../ui/FileUploadButton';
import { FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputArrowOr from '../ui/InputArrowOr';
import { useTranslation } from 'react-i18next';

const Addtasksor = () => {
    const { t, i18n } = useTranslation();
  const [locat, setLocation] = useState('');
  const isArabic = i18n.language === 'ar';

   const [benfit, setbenfit] = useState([]);
    const [requirment, setrequirment] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setid] = useState('');
  const [tozone, settozone] = useState('');
  const [fromzone, setfromzone] = useState('');
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [volunteers, setvolunteers] = useState('');
  const [image, setimage] = useState(null);
  const [value, setvalue] = useState('inactive');
  const [edit, setEdit] = useState(false);
  const [date, setDate] = useState('');
  const [orgnization, setorgnization] = useState('');
  const [description, setdescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    volunteers: '',
    organizers: '',
    start: '',
    name: '',
    description: '',
    tozone: '',
    fromzone: '',
    birthdate: '',
  });
  useEffect(() => {
    const { sendData } = location.state || {};

    if (sendData) {
      setid(sendData);
      setEdit(true);

      const token = localStorage.getItem('token');
      axios
        .get('https://backndVoo.voo-hub.com/api/ornization/task', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const event = response.data.tasks.find((e) => e.id === sendData);
          if (event) {
            setName(event.name || '');
           
            settozone(event.to_zone_id || '');
            setfromzone(event.from_zone_id || '');
            setLocation(event.location || '');
            setbenfit(
              event.event_benfits?.map((b) => ({ text: b.benfit, status: b.status })) || []
            );
            setrequirment(
              event.event_requirments?.map((r) => ({ text: r.requirment, status: r.status })) || []
            );
            setDate(event.date || '');
            setStart(event.start_time || '');
            setvolunteers(event.number_of_voo_needed || '');
            setdescription(event.description || '');
            setimage(event.image_link || null);
            setvalue(event.status || "")
            setorgnization(event.orgnization_id || "")
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
    if (name === "getZone") settozone(value)
  }
 
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'Task':
        setName(value);
        break;
      case 'getZone':
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
      case 'locat':
        setLocation(value);
        break;
    
      default:
        break;
    }
  };
  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = 'Task name is required';
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
      image: image,
      status: value,
      location: locat,
      orgnization_id:orgnization,
      benfit: benfit.map((item) => ({ benfit: item.text, })),
      requirment: requirment.map((item) => ({ requirment: item.text})),
    
         };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (edit) {
      axios
        .put(`https://backndVoo.voo-hub.com/api/ornization/task/update/${id}`, eventData, { headers })
        .then(() => {
          toast.success('Task updated successfully');
          setTimeout(() => navigate(-1), 2000);
        })
        .catch(() => toast.error('Failed to update event'));
    } else {
      axios
        .post('https://backndVoo.voo-hub.com/api/ornization/task/add', eventData, { headers })
        .then(() => {
          toast.success('Task added successfully');
          setTimeout(() => navigate(-1), 2000);
        })
        .catch(() => toast.error('Failed to add event'));
    }

    // Reset form
    setName('');
    setDate('');
    setStart('');
    setLocation('');
    setvolunteers('');
  
    setorgnization('');
    setimage(null);
    setdescription('');
    setvalue('inactive');
    settozone('');
    setbenfit([]);
    setrequirment([]);
    setfromzone('');
    setEdit(false);
    setid('')
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
      <AddAll name={edit ? t("Edittask") : t("Addtask")} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">{t("Information")}</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
         placeholder={t("Task")}
              name="Task"
              value={name}
              onChange={handleChange}
            />
            <InputField
              placeholder={t("description")}
              name="description"
              value={description}
              onChange={handleChange}
            />
           <InputField
          placeholder={t("location")}
              name="locat"
              value={locat}
              onChange={handleChange}
            />
          </div>
        </div>
     
        <div className=" flex flex-col  ">
          <span className="text-3xl font-bold text-three ">{t("Date_Time")}</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputArrowOr
              placeholder={t("From_zone")}
              name="getZone"
              value={fromzone}
              onChange={handleChange}
            />
            <InputArrowOr
              placeholder={t("To_zone")}
              name="getZone"
              value={tozone}
              onChange={handlechangetwo}
            />
            <div className="flex flex-col gap-3 items-start justify-end">
              <span className="text-[12px] font-bold text-one md:text-[16px]">{t("date")}</span>
              <div className="relative w-[200px] md:w-[300px] h-[48px] md:h-[72px]">
                <FaRegCalendarAlt className="absolute top-1/2 right-4 transform -translate-y-1/2 text-one z-10" />
                <DatePicker
                  selected={date}
                  minDate={new Date()} // يمنع اختيار أي تاريخ قبل النهارده
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
                  className={`w-full h-full`}
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
          <span className="text-3xl font-bold text-three ">{t("volunteers")}</span>
          <div className="flex flex-wrap gap-6 mt-6 bg-eight p-5">
            <InputField
              placeholder={t("number_of_volunteers")}
              name="volunteers"
              value={volunteers}
              onChange={handleChange}
              email="number"
            />


            <FileUploadButton name="image" kind={t("image")} flag={image} onFileChange={handleFileChange} />

          </div>
        </div>
        <SwitchButton value={value} setValue={setvalue} />
        <AddBenefitOr 
            benfit={benfit}
            setbenfit={setbenfit}
            requirment={requirment}
            setrequirment={setrequirment}/>
        <div className="flex mt-6">
          <button
            className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl"
            onClick={handleSave}
          >
          {t("Done")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Addtasksor
