import React, { useEffect, useState } from 'react'
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";
import { PiList } from "react-icons/pi";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  
useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="flex min-h-screen gap-3 mx-2 mt-2 relative">
        {isOpen&& 
    <aside className="w-32 lg:w-64 bg-gradient-to-b from-one to-two  sticky top-0 h-screen 0">
        <AdminSidebar setIsOpen={setIsOpen}  isOpen={isOpen}/> 
             
    </aside>}

    <div className="flex-1 flex flex-col gap-2 ">
      <header className=" bg-three rounded-[12px] shadow p-4  w-[95%]  mx-auto ">
        <AdminNavbar  setIsOpen={setIsOpen}  isOpen={isOpen}/>
      </header>

      <main className="flex-1  p-4">
        <Outlet />
      </main>
    </div>
  </div>
  )
}

export default AdminLayout
