import React, { useState } from 'react'
 import EventDetails from './pageOrOr/EventDetails'
 import Attendees from './pageOrOr/Attendees'
 import Issues from './pageOrOr/Issues'
 import Suggestions from './pageOrOr/Suggestions'
 import {  useLocation ,useNavigate } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';
       import IconDash from '../../ui/IconDash'

 const OperationOr = () => {
    const [activeTab, setActiveTab] = useState('EventDetails');
    const location = useLocation();
     const navigate = useNavigate();

    const { sendData } = location.state || {};
 const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
    const renderContent = () => {
      switch (activeTab) {
        case 'EventDetails':
          return <EventDetails id={sendData}/>;
        case 'Attendees':
          return <Attendees id={sendData}/>;
        case 'Issues':
          return <Issues id={sendData}/>;
        case 'Suggestions':
          return <Suggestions id={sendData}/>;
        default:
          return <div> </div>;
      }
    };
  return (
    <div className='flex flex-col gap-3 w-full'>
      <div  className=' flex  pl-5'>
    <button onClick={()=>navigate(-1)}>
    <IconDash width={28} height={28} tone="#6810B4"
     icon="M14.369 15.9496L22.5296 7.88571C22.959 7.45891 23.2 6.88156 23.2 6.27976C23.2 5.67796 22.959 5.10061 22.5296 4.67381C22.3153 4.4603 22.0604 4.29084 21.7795 4.17519C21.4985 4.05954 21.1972 4 20.8929 4C20.5886 4 20.2873 4.05954 20.0064 4.17519C19.7254 4.29084 19.4705 4.4603 19.2562 4.67381L9.48188 14.3323C9.26581 14.5441 9.09431 14.796 8.97728 15.0736C8.86024 15.3512 8.79999 15.6489 8.79999 15.9496C8.79999 16.2504 8.86024 16.5481 8.97728 16.8257C9.09431 17.1033 9.26581 17.3552 9.48188 17.567L19.2562 27.3394C19.4716 27.5505 19.727 27.7175 20.0079 27.8309C20.2888 27.9442 20.5895 28.0017 20.8929 28C21.1963 28.0017 21.497 27.9442 21.7779 27.8309C22.0588 27.7175 22.3142 27.5505 22.5296 27.3394C22.959 26.9126 23.2 26.3352 23.2 25.7334C23.2 25.1316 22.959 24.5543 22.5296 24.1275L14.369 15.9496Z" 
    />
    </button>
        </div>
    <div className='grid grid-cols-4 gap-4 mx-auto my-5 w-full'>
        <button
          className={`rounded-2xl w-full h-15 ${activeTab === 'EventDetails' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('EventDetails')}
          >
{t("EventDetails")}       


 </button>
        <button
          className={`rounded-2xl  w-full h-15 ${activeTab === 'Attendees' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Attendees')}
          >
          {t("Attendees")}       

        </button>
        <button
          className={`rounded-2xl h-15 w-full  ${activeTab === 'Issues' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Issues')}
          >
          {t("Issues")}       

        </button>
        <button
          className={`rounded-2xl h-15 w-full  ${activeTab === 'Suggestions' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Suggestions')}
          >
          {t("Suggestions")}       

        </button>
      </div>
          <div className='w-full'>{renderContent()}</div>
      </div>
  )
}
export default OperationOr