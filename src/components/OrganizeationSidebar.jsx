import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {  FaCalendarAlt } from "react-icons/fa"; 
import { FaUser } from "react-icons/fa6"; 
import IconTasks from '../Icons/IconTasks';
import { useTranslation } from 'react-i18next';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaPersonMilitaryToPerson } from "react-icons/fa6";

const links = [

  {
    to: "user",
    name: "Users",
    icon: <FaUser />,
    iconActive: <FaUser />
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
    icon: <IconTasks  />,
    iconActive: <IconTasks variant/>
  },
  {
    to: "requests",
    name: "Requests",
    icon: <VscGitPullRequestGoToChanges  />,
    iconActive: <VscGitPullRequestGoToChanges variant/>

  },
  {
   
       to: "pendingusers",
       name: "Pending",
       icon: <FaPersonMilitaryToPerson />,
       iconActive: <FaPersonMilitaryToPerson />
     

  },
 


];
const AdminSidebar = () => {
  const { t } = useTranslation();

  const [isActive, setIsActive] = useState('/organiztion/user');
  const location = useLocation();
  useEffect(() => {
    const customPaths = {
      '/organizeation/adduser': '/organizeation/user',
      '/organizeation/userDetails': '/organizeation/user',
      '/organizeation/eventsdetails': '/organizeation/events',
      '/organizeation/addeventsor': '/organizeation/events',
      '/organizeation/addtasksor': '/organizeation/tasks',
      '/organizeation/tasksdetails': '/organizeation/tasks',
      '/organizeation/pendingusersDetaklis': '/organizeation/pendingusers',
    };
  
    const newPath = customPaths[location.pathname] || location.pathname;
    setIsActive(newPath);
  }, [location.pathname]);
  

  return (
    <div className='h-screen '>

      <nav className="space-y-3 pt-6 text-center px-3 h-[calc(100vh-1px)] overflow-y-auto  overflow-x-hidden">
      <div className="flex gap-4 justify-start items-center  ">
        <i><FaHeart className="w-12 h-12 text-white" /></i>
        <h1 className="text-white font-bold text-[36px]">Voo</h1>
      </div>
      <div className="border-1 border-gray-300 w-full px-3" />

      {links.map((link) => {
        const isCurrent = isActive === `/organizeation/${link.to}`;

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
  {t(link.name)}
  </span>
          </NavLink>
        );
      })}
    </nav>
    </div>
  );
};

export default AdminSidebar;
