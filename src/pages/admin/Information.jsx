import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCrown } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";

const Information = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.user)
      })
  }, []);



  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className='flex flex-col'>
      <div className='bg-seven w-full h-50 flex relative'>
        <div className='flex justify-center items-center m-6'>
        <img src={data?.avatar_image_link??null} className='w-[152px] h-[152px]'  />
        </div>
        <div className='flex flex-col my-6'>
          <span className='text-[32px] font-medium text-one mb-3'>{data.name || "no name"}</span>
          <span className='text-[16px] font-light text-one mb-5'>{data.email || "no email"}</span>
          <span className='text-[16px] font-light py-1 px-2 text-one bg-eight items-center justify-center mb-3 flex gap-1'>
            <FaCrown />
            <span>Super Admin</span>
          </span>
        </div>
        <button onClick={handleLogout} className='absolute top-4 right-3'>
          <CiLogout className="text-one text-3xl" />
        </button>
          <button onClick={() => navigate('/admin/AddInformation')} className={`absolute top-16 right-3`}>
                  <FaUserEdit className="text-one text-3xl" />
                </button>
      </div>

      <div className='mt-5 w-full flex-wrap flex gap-2'>
        <div className='bg-seven w-full h-fit flex flex-col p-5'>
          <div className='flex gap-1 items-center'>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 0C5.81875 0 0 5.81875 0 13C0 20.1812 5.81875 26 13 26C20.1812 26 26 20.1812 26 13C26 5.81875 20.1812 0 13 0ZM12.7188 6.5C13.4125 6.5 13.9688 7.0625 13.9688 7.75C13.9688 8.4375 13.4062 9 12.7188 9C12.0312 9 11.4688 8.4375 11.4688 7.75C11.4688 7.0625 12.025 6.5 12.7188 6.5ZM15 19H11V18.5H12V11H11V10.5H14V18.5H15V19Z" fill="#730FC9"/>
</svg>
            <span className='text-2xl font-medium text-one'>Personal Information</span>
          </div>

          <div className='flex flex-col gap-2 my-2'>
            <span className='text-[20px] font-normal text-one'>Phone Number: {data.phone || "No phone"}</span>
            {/* <span className='text-[20px] font-normal text-one'>Birth Date: {data.birth || "No birthdate"}</span> */}
            <span className='text-[20px] font-normal text-one'>Gender: {data.gender || "No gender"}</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
