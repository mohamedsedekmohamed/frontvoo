import React, { useEffect, useState, useRef } from 'react';
import { FaRegBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { PiList } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ isOpen, setIsOpen }) => {
  const [data, setData] = useState([]);
  const [conut, setConut] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const prevCount = useRef(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get("https://backndVoo.voo-hub.com/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.user)
      });
  }, []);

  useEffect(() => {
    const fetchCount = () => {
      axios.get("https://backndVoo.voo-hub.com/api/admin/noti/notification_num", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          const newCount = response.data.requests_count;

          if (newCount > prevCount.current) {
            setShowPopup(true);
          }

          prevCount.current = newCount;
          setConut(newCount);
        })
        .catch(err => {
          console.error("Failed to fetch notification count", err);
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-between items-center relative">
      <div className='flex items-center gap-0.5'>
        {data.avatar_image_link ? (
          <img src={data.avatar_image_link} className='w-4 md:w-10 md:h-10 h-4 rounded-full' />
        ) : (
          <span className='w-4 md:w-10 h-4 md:h-10 bg-gray-200 rounded-full' />
        )}
        <div className='flex flex-col gap-0.5'>
          <span className='text-[12px] md:text-2xl font-bold text-white'>{data.name || "no name"}</span>
        </div>
      </div>

      <div className='flex items-center gap-0.5'>
        <div className='block lg:hidden'>
          {!isOpen && (
            <button className='bg-white text-[12px] md:text-2xl' onClick={() => setIsOpen(!isOpen)}>
              <PiList className='text-one text-[12px] md:text-2xl' />
            </button>
          )}
        </div>

        <button onClick={() => navigate('/admin/information')}>
          <IoPersonCircleSharp className='text-[12px] md:text-2xl text-white' />
        </button>

        <div className="relative" onClick={() => navigate('/admin/newnotification')}>
          <span className="absolute -top-1 -right-1 bg-white text-one text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-one font-bold">
            {conut}
          </span>
          <FaRegBell className="text-white text-[12px] md:text-2xl" />
        </div>
      </div>
 {showPopup && (
  <>
    <div className="fixed inset-0 bg-black/40 z-40"></div>

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-one px-6 py-5 rounded-xl shadow-2xl z-50 w-[90%] max-w-sm flex flex-col items-center gap-4 border border-one">
      <p className="text-lg font-semibold text-center">   🔔 You have new messages</p>
      <div className="flex gap-4">
        <button
          onClick={() => {
            navigate('/admin/newnotification');
            setShowPopup(false);
          }}
          className="bg-one text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Show
        </button>
        <button
          onClick={() => setShowPopup(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </>
)}


    </div>
  );
}

export default AdminNavbar;
