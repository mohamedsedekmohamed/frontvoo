import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import {  FaCog, FaCalendarAlt } from "react-icons/fa"; 
import { FaUser } from "react-icons/fa6"; 
import { RiOrganizationChart } from "react-icons/ri";
import IconTasks from '../Icons/IconTasks';
import IconCity from '../Icons/IconCity';
import IconOperation from '../Icons/IconOperation';
import { HiFlag } from "react-icons/hi";
import { HiOutlineSignal } from "react-icons/hi2";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaPersonMilitaryToPerson } from "react-icons/fa6";
import { PiCityFill } from "react-icons/pi";
import { FaTasks } from "react-icons/fa";
const links = [
  {
    to: "home",
    name: "Home",
    icon: <IoMdHome />,
    iconActive: <IoMdHome />
  },
  {
    to: "user",
    name: "Users",
    icon: <FaUser />,
    iconActive: <FaUser />
  },
  {
    to: "organizeation",
    name: "Organization",
    icon: <RiOrganizationChart />,
    iconActive: <RiOrganizationChart />
  },
  {
    to: "events",
    name: "Events",
    icon: <FaCalendarAlt />,
    iconActive: <FaCalendarAlt />
  },
  {
    to: "tasks",
    name: "Tasks",
    icon: <FaTasks  />,
    iconActive: <FaTasks variant  />,
  },
  {
    to: "requests",
    name: "Requests",
    icon: <VscGitPullRequestGoToChanges  />,
    iconActive: <VscGitPullRequestGoToChanges variant/>
  },
  {
    to: "country",
    name: "Country",
    icon: <HiFlag />,
    iconActive: <HiFlag />
  },
  {
    to: "city",
    name: "City",
    icon: <PiCityFill  />,
    iconActive: <PiCityFill    />,
  },
  {
    to: "zone",
    name: "Zone",
    icon: <HiOutlineSignal />,
    iconActive: <HiOutlineSignal />
  },
  {
    to: "pendingusers",
    name: "Pending users",
    icon: <FaPersonMilitaryToPerson />,
    iconActive: <FaPersonMilitaryToPerson />
  },

    {
      to: "settings",
      name: "Settings",
      icon: <FaCog />,
      iconActive: <FaCog />
    }
  
];
const AdminSidebar = ({setIsOpen,isOpen}) => {
  const [isActive, setIsActive] = useState('/admin/home');
  const location = useLocation();
  useEffect(() => {
    const customPaths = {
      '/admin/addUser': '/admin/user',
      '/admin/userdetails': '/admin/user',
      '/admin/addorganizeation': '/admin/organizeation',
      '/admin/organizeationdatali': '/admin/organizeation',
      '/admin/addevents': '/admin/events',
      '/admin/operation': '/admin/events',
      '/admin/eventDetalis': '/admin/events',
      '/admin/addtasks': '/admin/tasks',
      '/admin/operationTasks': '/admin/tasks',
      '/admin/requestsdetails': '/admin/requests',
      '/admin/tasksDetails': '/admin/tasks',
      '/admin/addcountry': '/admin/country',
      '/admin/addcity': '/admin/city',
      '/admin/addzone': '/admin/zone',
      '/admin/pendingusersDetaklis': '/admin/pendingusers',
    };
  
    const newPath = customPaths[location.pathname] || location.pathname;
    setIsActive(newPath);
  }, [location.pathname]);
  
  return (
    <div className='h-screen '>

      <nav className="hidden md:block space-y-3 pt-6 text-center px-3 h-[calc(100vh-1px)] overflow-y-auto  overflow-x-hidden">
      <div className="flex gap-4 justify-start items-center  ">
        <i><FaHeart className="w-12 h-12 text-white" /></i>
        <h1 className="text-white font-bold text-[36px]">Voo</h1>
      </div>
      <div className="border-1 border-gray-300 w-full px-3" />

      {links.map((link) => {
        const isCurrent = isActive === `/admin/${link.to}`;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`flex gap-2 w-[220px] rounded-lg h-[56px] items-center pl-3 transition-all duration-200 ${
              isCurrent ? "bg-white" : ""
            }`}
          >
            <div className="w-6 h-6">
              {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                className: `w-[22px] h-[22px] ${isCurrent ? "text-one" : "text-white"}`
              })}
            </div>
            <span
              className={`font-bold text-[20px] ${isCurrent ? "text-one" : "text-white"}`}
            >
              {link.name}
            </span>
          </NavLink>
        );
      })}
    </nav>
{isOpen && <div className='' onClick={()=>setIsOpen(!isOpen)}>
<nav className="block md:hidden space-y-3 pt-6 text-center px-3 h-[calc(100vh-1px)] overflow-y-auto  overflow-x-hidden">
      <div className="flex gap-4 justify-start items-center  ">
        <i><FaHeart className="w-6 h-6 text-white" /></i>
        <h1 className="text-white font-bold text-[16px]">Voo</h1>
      <button   onClick={()=>setIsOpen(!isOpen)} className='text-white border-2 rounded-full'>X</button>
      </div>
      <div className="border-1 border-gray-300 w-full px-1" />

      {links.map((link) => {
        const isCurrent = isActive === `/admin/${link.to}`;

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`flex gap-2 w-[110px] rounded-lg h-[56px] items-center pl-3 transition-all duration-200 ${
              isCurrent ? "bg-white" : ""
            }`}
          >
            <div className="w-6 h-6">
              {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                className: `w-[11px] h-[22px] ${isCurrent ? "text-one" : "text-white"}`
              })}
            </div>
            <span
              className={`font-bold text-[10px] ${isCurrent ? "text-one" : "text-white"}`}
            >
              {link.name}
            </span>
          </NavLink>
        );
      })}
    </nav>
  </div>}
   
    
    </div>
  );
};

export default AdminSidebar;
