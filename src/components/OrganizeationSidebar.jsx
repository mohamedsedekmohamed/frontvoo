import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {  FaCalendarAlt } from "react-icons/fa"; 
import { FaUser } from "react-icons/fa6"; 
import IconTasks from '../Icons/IconTasks';
import { useTranslation } from 'react-i18next';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { FaPersonMilitaryToPerson } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { VscProject } from "react-icons/vsc";
import { MdDynamicFeed } from "react-icons/md";

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
    to: "projectOr",
    name: "Project",
    icon: <VscProject  />,
    iconActive: <VscProject variant/>

  },
  {
    to: "Feedsor",
    name: "NewFeeds",
    icon: <MdDynamicFeed  />,
    iconActive: <MdDynamicFeed variant/>

  },
  {
   
       to: "pendingusers",
       name: "Pending",
       icon: <FaPersonMilitaryToPerson />,
       iconActive: <FaPersonMilitaryToPerson />
     

  },
 


];
const OrganizeationSidebar = ({ setIsOpen, isOpen }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [isActive, setIsActive] = useState('/organizeation/user');
  const location = useLocation();

  useEffect(() => {
    // احتفظ بالـ customPaths الخاصة بك كما هي
    const customPaths = { /* مساراتك */ };
    const newPath = customPaths[location.pathname] || location.pathname;
    setIsActive(newPath);
  }, [location.pathname]);

  return (
    <>
      {/* خلفية مظلمة (Overlay) للموبايل */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* هيكل القائمة الجانبية */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-one to-two transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          
          {/* ترويسة القائمة */}
          <div className="flex justify-between items-center p-5">
            <div className="flex gap-3 items-center">
              <FaHeart className="w-8 h-8 text-white" />
              <h1 className="text-white font-bold text-2xl md:text-3xl">Voo</h1>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden text-white hover:bg-white/20 p-1 rounded-md text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="border-b border-white/20 w-[90%] mx-auto mb-4" />

          {/* الروابط */}
          <nav className="flex-1 px-4 space-y-1 pb-6">
            {links.map((link) => {
              const isCurrent = isActive === `/organizeation/${link.to}`;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`flex gap-3 w-full rounded-lg px-3 py-3 items-center transition-all duration-200 ${
                    isCurrent ? "bg-white shadow-md" : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 shrink-0">
                    {React.cloneElement(isCurrent ? link.iconActive : link.icon, {
                      className: `w-5 h-5 ${isCurrent ? "text-one" : "text-white"}`
                    })}
                  </div>
                  <span className={`font-semibold text-sm md:text-base whitespace-nowrap ${isCurrent ? "text-one" : "text-white"}`}>
                    {t(link.name)}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default OrganizeationSidebar;