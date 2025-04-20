import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import {  FaCog, FaCalendarAlt } from "react-icons/fa"; 
import { FaUser } from "react-icons/fa6"; 
import { RiOrganizationChart } from "react-icons/ri";
import IconTasks from '../Icons/IconTasks';
import IconCity from '../Icons/IconCity';
import { HiFlag } from "react-icons/hi";
import { HiOutlineSignal } from "react-icons/hi2";
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
    icon: <IconTasks  />,
    iconActive: <IconTasks variant/>
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
    icon: <IconCity />,
    iconActive: <IconCity  variant/>
  },
  {
    to: "zone",
    name: "Zone",
    icon: <HiOutlineSignal />,
    iconActive: <HiOutlineSignal />
  },
  {
    to: "settings",
    name: "Settings",
    icon: <FaCog />,
    iconActive: <FaCog />
  },
];
const AdminSidebar = () => {
  const [isActive, setIsActive] = useState('/admin/home');
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === '/admin/addUser') {
      setIsActive('/admin/user');
    }else{
      setIsActive(location.pathname);
    }
  }, [location.pathname]);

  return (
    <nav className="space-y-3 pt-6 text-center px-3">
      <div className="flex gap-4 justify-start items-center">
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
            className={`flex gap-2 w-[230px] rounded-lg h-[56px] items-center pl-3 transition-all duration-200 ${
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
  );
};

export default AdminSidebar;
