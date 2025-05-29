
    import React, { useState } from 'react'
    import EventDetails from './pageTasks/EventDetails'
    import Attendees from './pageTasks/Attendees'
    import Issues from './pageTasks/Issues'
    import Suggestions from './pageTasks/Suggestions'
    import {  useLocation } from 'react-router-dom';
   
    const OperationTasks = () => {
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
   export default OperationTasks