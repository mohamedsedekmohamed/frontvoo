import React, { useState } from 'react'
 import EventDetails from './pageOr/EventDetails'
 import Attendees from './pageOr/Attendees'
 import Issues from './pageOr/Issues'
 import Suggestions from './pageOr/Suggestions'
 import {  useLocation } from 'react-router-dom';

 const Operation = () => {
    const [activeTab, setActiveTab] = useState('EventDetails');
    const location = useLocation();
    const { sendData } = location.state || {};

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
    <div className='flex flex-col gap-3 lg:w-full'>
    <div className='grid   grid-cols-1 md:grid-cols-2  lg:grid-cols-4  gap-2 lg:gap-4 mx-auto my-5 w-[200px] md:w-[250px] lg:w-full'>
        <button
          className={`rounded-2xl  w-full h  h-15 ${activeTab === 'EventDetails' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('EventDetails')}
          >
          Event Details
        </button>
        <button
          className={`rounded-2xl   w-full h h-15 ${activeTab === 'Attendees' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Attendees')}
          >
          Attendees
        </button> 
        <button
          className={`rounded-2xl h-15    w-full h ${activeTab === 'Issues' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Issues')}
          >
          Issues
        </button>
        <button
          className={`rounded-2xl h-15   w-full h  ${activeTab === 'Suggestions' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('Suggestions')}
          >
          Suggestions
        </button>
      </div>
          <div className='w-full mx-auto'>{renderContent()}</div>
          
      </div>
  )
}
export default Operation