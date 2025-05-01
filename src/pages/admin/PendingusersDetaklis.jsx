import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
const PendingusersDetaklis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data,setData]=useState('')
      useEffect(()=>{
          const { sendData } = location.state || {};
          console.log(sendData)
          const token = localStorage.getItem('token');
          axios.get(`https://backndVoo.voo-hub.com/api/admin/bnyadm/${sendData}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              setData(response.data?.data??[]);
            })
            .catch(() => {
            });
      },[location.state])
    return (
      <div className='flex flex-col relative'> 
       <div className='w-full text-right absolute'> <button   className='text-3xl text-nine' onClick={()=>navigate(-1)} ><MdOutlineArrowBackIos /></button></div>
  
  <div className='flex gap-2 items-center '>
     <VscGitPullRequestGoToChanges className='text-[24px] text-one'/>
   <span className='text-2xl font-medium my-6'>Pending users </span></div>
  
   <div className='w-[50%] flex flex-wrap'>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">back identity</span>
                      <img className="h-30" src={data?.back_identity ?? ""} alt="back_identity" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">front_identity</span>
                      <img className="h-30" src={data?.front_identity ?? ""} alt="front_identity" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">selfi image</span>
                      <img className="h-30" src={data?.selfi_image ?? ""}  alt="selfi_image" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="mb-2 text-sm text-gray-700">orgnization paper</span>
                      <img className="h-30" src={data?.orgnization_paper ?? ""} alt="orgnization_paper"  />
                    </div>
                  </div>
            
              </div>
          </div>
    )
  }




export default PendingusersDetaklis
