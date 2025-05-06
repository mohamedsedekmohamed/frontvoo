import React, { useState } from 'react'
 import EventDetails from './pageOrOr/EventDetails'
 import Attendees from './pageOrOr/Attendees'
 import Issues from './pageOrOr/Issues'
 import Suggestions from './pageOrOr/Suggestions'
 import {  useLocation } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';

 const OperationOr = () => {
    const [activeTab, setActiveTab] = useState('EventDetails');
    const location = useLocation();
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