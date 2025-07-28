import React, { useEffect, useState } from 'react'
import { FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";import BarChart from "../../ui/BarChart"
import { FaTableCells } from "react-icons/fa6";
import { VscCheck } from "react-icons/vsc";
import { RxLapTimer } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImUsers } from "react-icons/im";
import { FaHouseFlag } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import PieChartComponent from '../../ui/PieChartComponent'
import VolunteerByCityRadarChart  from '../../ui/VolunteerByCityRadarChart'
import RecentEventList from '../../ui/RecentEventList'
const HomeOr = () => {

     const { t, i18n } = useTranslation();

  const [data, setData] = useState([]);

 useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/ornization/Home", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data);
    })
      .catch(() => {
      });
  }, []);
 
  return (
    <div className='w-full mt-6 '>
      {/* boxs */}
  <div class="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2 h-full mx-5">
    {/* one */}
<div className='w-[23%} h-[159px] bg-threeteen  text-[#27AE60] flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><FaUsers className='text-#27AE60'/></i><span>{t("ActiveVolunteers")}    </span> </div>
  <span className='text-2xl'>{data.users_volunters??"0"}</span>
</div>
{/* two */}
<div className='w-[23%} h-[159px] bg-fourteen  text-[#4A90E2] flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl items-center'><i><FaTableCells className='text-[#4A90E2]'/></i><span>{t("CurrentTasks")} </span> </div>
  <span className='text-2xl'> {data.current_tasks_count??"0"}</span>
</div>

{/* threr */}

<div className='w-[23%} h-[159px] bg-threeteen text-[#16A085] flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><VscCheck className='text-[#16A085]'/></i><span>{t("CompletedTasks")}  </span> </div>
  <span className='text-2xl'> {data.ended_tasks_count??"0"}</span>
</div>
{/* four */}
<div className='w-[23%} h-[159px] bg-fourteen  text-[#F39C12] flex flex-col  gap-4 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[18px] lg:text-[20px]  items-center'><i><ImUsers className='text-[#F39C12]'/></i><span>{t("UsersCount")}   </span> </div>
  <span className='text-2xl'> {data.users_count??"0"}</span>
</div>
</div>
{/* القسم الأول: BarChart و PieChart */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 my-6">
  <div className="w-full bg-white p-4 rounded shadow">
    <BarChart All={data.user_year} />
  </div>
  <div className="w-full bg-white p-4 rounded shadow">
    <PieChartComponent />
  </div>
</div>

{/* القسم الثاني: RadarChart و RecentEventList */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-6">
  <div className="w-full bg-white p-4 rounded shadow">
    <VolunteerByCityRadarChart data={data.volunteer_cities} />
  </div>
  <div className="w-full bg-white p-4 rounded shadow">
    <RecentEventList recent_event={data.recent_event} />
  </div>
</div>

{/*  */}
          <ToastContainer />
    
    </div>
  )}
export default HomeOr
