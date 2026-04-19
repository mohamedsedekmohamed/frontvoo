import React, { useEffect, useState } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // إغلاق القائمة الجانبية عند تغيير المسار في الموبايل
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // التحكم في حالة القائمة بناءً على حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // تعيين الحالة المبدئية
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* القائمة الجانبية */}
      <AdminSidebar setIsOpen={setIsOpen} isOpen={isOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-three rounded-xl shadow m-3 md:m-4 mb-2 p-3 md:p-4 shrink-0 relative z-10">
          <AdminNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-4 pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;