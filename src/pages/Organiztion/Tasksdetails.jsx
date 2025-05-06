import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import {   FaCalendarAlt } from "react-icons/fa"; 
import { FaUser } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { SlOrganization } from "react-icons/sl";
import { HiClock } from "react-icons/hi2";
import { useTranslation } from 'react-i18next';

const Tasksdetails = () => {
 const navigate = useNavigate();
  const location = useLocation();
  const [data,setData]=useState('')
  const [activeTab, setActiveTab] = useState('info');
   const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
      useEffect(()=>{
          const { sendData } = location.state || {};
          console.log(sendData)
          const token = localStorage.getItem('token');
          axios.get(`https://backndVoo.voo-hub.com/api/ornization/task/${sendData}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              setData(response.data?.task??[]);
            })
            .catch(() => {
            });
      },[location.state])
         const renderContent = () => {
            switch (activeTab) {
              case 'info':
                return <div className='flex flex-col gap-3'>   
            <div className='flex gap-2 items-center '>
            <FaCalendarAlt className='h-10 w-10 text-one'/>
          <span className='text-2xl font-medium text-one my-6'>{t('EventInformation')}</span>
          </div>
          <div className='flex justify-between'>
      
        <div className='flex flex-col gap-2 justify-between'>
           
                <span className='text-nine text-[16px]'> {t('description')}: {data?.description ?? "N/A"}</span>
                <span className='text-nine text-[16px]'> {t('statue')}: {data?.status ?? "N/A"}</span>
             </div>
          
          </div>
                </div>
              case 'events':
                return  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-one">{t("EventLocation")}</p>
                <div className="mt-2 flex flex-col gap-2">
                <span className='text-nine text-[16px]'>{t("Country")}: {data?.to_zone?.city?.country?.name ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("City")}: {data?.to_zone?.city?.name ?? "N/A"}</span>
                <span className='text-nine text-[16px]'>{t("Zone")}: {data?.to_zone?.name ?? "N/A"}</span>
                </div>
              </div>
              case 'tasks':
                return<div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <p className="text-xl font-semibold text-one">{t("EventRequirements")}:</p>
                <div className="mt-2">
                <div className="mt-2 flex flex-col gap-2">
                <span className='text-nine text-[16px]'>{t("numberneeded")}: {data?.number_of_voo_needed ?? "N/A"}</span>
                </div>
                </div>
              </div>
       ;
              default:
                return <div> </div>;
            }
          };
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
                     {t("location")}

            </button>
            <button
              className={`rounded-2xl h-15 ${activeTab === 'tasks' ? 'bg-one text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('tasks')}
            >
                        {t("number")}

            </button>
          </div>
          <div className='grid grid-cols-3 gap-4 mx-auto my-5'>
    
          <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
        <FaUser className='h-10 w-10 text-one'/>
            <div className='flex flex-col gap-1'>
            <span className='text-nine text-[16px]'>{t("Name")}</span>
            <span className='text-[24px] text-one'>{data?.name ?? "N/A"}</span>
            </div>
            </div>
            {/*  */}
          <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
        <SlOrganization className='h-10 w-10 text-one'/>
            <div className='flex flex-col gap-1'>
            <span className='text-nine text-[16px]'>{t("Organization")}</span>
            <span className='text-[24px] text-one'>{data?.orgnization?.name ?? "N/A"}</span>
            </div>
            </div>
            {/*  */}
          <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
        <HiClock className='h-10 w-10 text-one'/>
            <div className='flex flex-col gap-1'>
             <span className='text-nine text-[16px]'>{t('time')}  </span>
             <div className='flex  flex-col gap-0.5'>
             <span className=' text-[16px] text-one'> {t("start")}:{data?.start_time ?? "N/A"}</span>
             <span className=' text-[16px] text-one'>{t("end")}{data?.date ?? "N/A"}</span>
             </div>
   
            </div>
            </div>
        
       
    </div>
          <div>
            {renderContent()}
          </div>
        </div>
       
          )  
  }

export default Tasksdetails

