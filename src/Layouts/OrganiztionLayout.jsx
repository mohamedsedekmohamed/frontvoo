import React, { useEffect, useState } from 'react';
import OrganizeationSidebar from "../components/OrganizeationSidebar";
import OrganizationNavbar from "../components/OrganizeationNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const OrganiztionLayout = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* القائمة الجانبية */}
      <OrganizeationSidebar setIsOpen={setIsOpen} isOpen={isOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-three rounded-xl shadow m-3 md:m-4 mb-2 p-3 md:p-4 shrink-0 relative z-10">
          <OrganizationNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-4 pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganiztionLayout;