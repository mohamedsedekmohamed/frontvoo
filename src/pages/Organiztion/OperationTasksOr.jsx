import React, { useState } from 'react'
import EventDetails from './pageTasksOr/EventDetails'
import Attendees from './pageTasksOr/Attendees'
import Issues from './pageTasksOr/Issues'
import Suggestions from './pageTasksOr/Suggestions'
import {  useLocation } from 'react-router-dom';

const OperationTasksOr = () => {
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
   <div className='flex flex-col gap-3 w-full'>
   <div className='grid grid-cols-4 gap-4 mx-auto my-5 w-full'>
       <button
         className={`rounded-2xl w-full h-15 ${activeTab === 'EventDetails' ? 'bg-one text-white' : 'bg-gray-200'}`}
         onClick={() => setActiveTab('EventDetails')}
         >
         Event Details
       </button>
       <button
         className={`rounded-2xl  w-full h-15 ${activeTab === 'Attendees' ? 'bg-one text-white' : 'bg-gray-200'}`}
         onClick={() => setActiveTab('Attendees')}
         >
         Attendees
       </button>
       <button
         className={`rounded-2xl h-15 w-full  ${activeTab === 'Issues' ? 'bg-one text-white' : 'bg-gray-200'}`}
         onClick={() => setActiveTab('Issues')}
         >
         Issues
       </button>
       <button
         className={`rounded-2xl h-15 w-full  ${activeTab === 'Suggestions' ? 'bg-one text-white' : 'bg-gray-200'}`}
         onClick={() => setActiveTab('Suggestions')}
         >
         Suggestions
       </button>
     </div>
         <div className='w-full'>{renderContent()}</div>
     </div>
 )
}
export default OperationTasksOr
