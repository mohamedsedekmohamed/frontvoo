import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { SlOrganization } from "react-icons/sl";
import { HiClock } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';
import { IoPersonSharp } from "react-icons/io5";
import IconDate from '../../Icons/IconDate';
import { IoLocationSharp } from "react-icons/io5";
import { RiOrganizationChart } from "react-icons/ri";
import { TbFileDescription } from "react-icons/tb";

const UserDetails = () => {
  const location = useLocation();
  const [data, setData] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2 items-center'>
              <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9998 5.13129C12.3816 5.13129 12.691 4.82136 12.691 4.43905C12.691 4.05674 12.3816 3.74683 11.9998 3.74683C11.6181 3.74683 11.3086 4.05674 11.3086 4.43905C11.3086 4.82136 11.6181 5.13129 11.9998 5.13129Z" fill="#6810B4" />
                <path d="M11.9998 6.74854V11.6544" stroke="#6810B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.09324 0.943359C0.819913 0.943359 0.599854 1.16423 0.599854 1.43866V14.8594C0.599854 15.1338 0.819913 15.3548 1.09324 15.3548H4.10484V20.0569L13.3538 15.3548H17.4531H22.9064C23.1798 15.3548 23.3998 15.1338 23.3998 14.8594V1.43866C23.3998 1.16423 23.1798 0.943359 22.9064 0.943359H1.09324Z" stroke="#6810B4" strokeWidth="1.5" strokeMiterlimit="6.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className='text-2xl font-medium my-6'>{t("Information")}</span>
            </div>

            <div className='flex justify-between'>
              <div className='flex flex-col gap-2 justify-between'>
                <span className='text-nine text-[16px]'>{t("Phone")}: {data?.phone ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("Email")}: {data?.email ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("Country")}: {data?.country?.name ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("City")}: {data?.city?.name ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("Birthdate")}: {data?.birth ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("Gender")}: {data?.gender ?? "N/A"}</span>
              </div>

              <div className='w-[50%] flex flex-wrap'>
                {Array.isArray(data?.user_papers) && data.user_papers.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">{t("Back")}</span>
                      <img className="h-30" src={data?.user_papers?.[0]?.back_identity ?? ""} alt={t("Back")} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">{t("Front")}</span>
                      <img className="h-30" src={data?.user_papers?.[0]?.front_identity ?? ""} alt={t("Front")} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">{t("Selfie")}</span>
                      <img className="h-30" src={data?.user_papers?.[0]?.selfi_image ?? ""}  alt={t("Selfie")}/>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">{t("Paper")}</span>
                      <img className="h-30" src={data?.user_papers?.[0]?.orgnization_paper ?? ""} alt={t("Paper")} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'events':
        return<div className="flex flex-col gap-4">
          
        <h2 className="text-2xl font-semibold text-three mb-6">{t("AllEvents")}</h2>
      
        {data?.user_events?.map((event,index) => (
          <details
            key={event.id}
            className=" rounded-md shadow-md  bg-elven" 
          >
            <summary className="cursor-pointer  my-4 text-lg font-semibold text-white">
      {index+1}  {t("Event")}  
        </summary>
      
            <div className=" bg-four text-sm mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-4">
              <div className='p-4 space-y-2'>
      
        <div className=" rounded flex gap-2 items-center  "> 
        <IoPersonSharp  className='text-three text-2xl font-medium'/>
        <span className='text-three font-semibold text-[20px]'>{t("Eventname")}</span>
              </div>
              <span className='text-twelve font-semibold text-[16px]'>{event.name ?? "N/A"}</span>
        
        </div>
      
        <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <IconDate variant/>
      <span className='text-three font-semibold text-[20px]'>{t("DateTimeDetails")} </span>
            </div>
            <div className='flex flex-col gap-4'>
            <span className='text-twelve font-semibold text-[16px]'>{t("date")}: {event.date  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'> {t("start")} : {event.start_time  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'>{t("end")} : {event.end_time  ?? "N/A"}</span>
            </div>
      
      </div>
      
      
      <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <IoLocationSharp  className='text-three text-2xl font-medium'/>
      <span className='text-three font-semibold text-[20px]'>{t("LocationMapLink")} </span>
            </div>
            <div className='flex flex-col gap-4'>
            <span className='text-twelve font-semibold text-[16px]'>{t("location")}: {event.location  ?? "N/A"}</span>
            <span className='text-twelve font-semibold   text-[16px]'> {t("MapLink")}:<a   className="underline" href={event.google_maps_location }>{event.google_maps_location  ?? "N/A"}</a></span>
            </div>
      
      </div>
      
      
      <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <TbFileDescription  className='text-three text-2xl font-medium'/>
      <span className='text-three font-semibold text-[20px]'>{t("description")}  </span>
            </div>
            <span className='text-twelve font-semibold text-[16px]'> {event.description  ?? "N/A"}</span>
      
      </div>
        
      <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <RiOrganizationChart  className='text-three text-2xl font-medium'/>
      <span className='text-three font-semibold text-[20px]'>{t("VolunteersOrganizersInformation")} </span>
            </div>
            <div className='flex flex-col gap-4'>
            <span className='text-twelve font-semibold text-[16px]'>{t("NumberofVolunteers")}: {event.number_of_volunteers  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'>{t("AvailableVolunteers")}: {event.available_volunteers  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'> {t("NumberOfOrganizers")}: {event.number_of_organizers  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'>{t("EventHours")} : {event.event_hours  ?? "N/A"}</span>
            </div>
            
      </div>
      </div>
            </div>
          </details>
        ))}
      </div>
      








      case 'tasks':
        return <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-three mb-6">{t("AllTasks")}</h2>
      
        {data?.user_tasks?.map((event,index) => (
          <details
            key={event.id}
            className=" rounded-md shadow-md  bg-elven" 
          >
            <summary className="cursor-pointer  my-4 text-lg font-semibold text-white">
      {index+1}  {t("Task")}  
        </summary>
      
            <div className=" bg-four text-sm mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-4">
              <div className='p-4 space-y-2'>
      
        <div className=" rounded flex gap-2 items-center  "> 
        <IoPersonSharp  className='text-three text-2xl font-medium'/>
        <span className='text-three font-semibold text-[20px]'>  {t("Taskname")} </span>
              </div>
              <span className='text-twelve font-semibold text-[16px]'>{event.name ?? "N/A"}</span>
        
        </div>
      
        <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <IconDate variant/>
      <span className='text-three font-semibold text-[20px]'>{t("NumberofVolunteers")} </span>
            </div>
            <div className='flex flex-col gap-4'>
            <span className='text-twelve font-semibold text-[16px]'>{t("date")}: {event.date  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'>{t("start")}  : {event.start_time  ?? "N/A"}</span>
            <span className='text-twelve font-semibold text-[16px]'>  {t("taskhours")}: {event.task_hours  ?? "N/A"}</span>

            </div>
      
      </div>
      
      
      <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <IoLocationSharp  className='text-three text-2xl font-medium'/>
      <span className='text-three font-semibold text-[20px]'>  </span>
            </div>
            <div className='flex flex-col gap-4'>
            <span className='text-twelve font-semibold text-[16px]'>{t("location")}: {event.location  ?? "N/A"}</span>
            <span className='text-twelve font-semibold   text-[16px]'>  {t("MapLink")}:<a   className="underline" href={event.google_maps_location }>{event.google_map_location  ?? "N/A"}</a></span>
            </div>
      
      </div>
      
      
      <div className='p-4 space-y-2'>
      
      <div className=" rounded flex gap-2 items-center  "> 
      <TbFileDescription  className='text-three text-2xl font-medium'/>
      <span className='text-three font-semibold text-[20px]'>{t("description")}  </span>
            </div>
            <span className='text-twelve font-semibold text-[16px]'> {event.description  ?? "N/A"}</span>
      
      </div>
        

      </div>
            </div>
          </details>
        ))}
      </div>
      default:
        return <div> </div>;
    }
  };

  useEffect(() => {
    const { sendData } = location.state || {};
    const token = localStorage.getItem('token');
    axios.get(`https://backndVoo.voo-hub.com/api/ornization/user/${sendData}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data?.user ?? []);
      })
      .catch(() => {});
  }, [location.state]);

  return (
    <div>
      <div className='grid grid-cols-3 gap-4 mx-auto my-5'>
        <button
          className={`rounded-2xl h-15 ${activeTab === 'info' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('info')}
        >
          {t("Info")}
        </button>
        <button
          className={`rounded-2xl h-15 ${activeTab === 'events' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('events')}
        >
          {t("Events")}
        </button>
        <button
          className={`rounded-2xl h-15 ${activeTab === 'tasks' ? 'bg-one text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tasks')}
        >
          {t("Tasks")}
        </button>
      </div>

      <div className='grid grid-cols-3 gap-4 mx-auto my-5'>
        <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
          <FaUser className='h-10 w-10 text-one' />
          <div className='flex flex-col gap-1'>
            <span className='text-nine text-[16px]'>{t("Name")}</span>
            <span className='text-[24px] text-one'>{data?.name ?? "N/A"}</span>
          </div>
        </div>

        <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
          <SlOrganization className='h-10 w-10 text-one' />
          <div className='flex flex-col gap-1'>
            <span className='text-nine text-[16px]'>{t("Organization")}</span>
            <span className='text-[24px] text-one'>{data?.orgnization?.name ?? "N/A"}</span>
          </div>
        </div>

        <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
          <HiClock className='h-10 w-10 text-one' />
          <div className='flex flex-col gap-1'>
            <span className='text-nine text-[16px]'>{t("Total_hours")}</span>
            <span className='text-[24px] text-one'>{data?.total_hours ?? "N/A"}</span>
          </div>
        </div>
      </div>

      <div>{renderContent()}</div>
    </div>
 
  );
} 
export default UserDetails;