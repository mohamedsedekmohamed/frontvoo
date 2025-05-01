import React, { useEffect } from 'react'
import OrganizeationSidebar from "../components/OrganizeationSidebar";
import OrganizationNavbar from "../components/OrganizeationNavbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const OrganiztionLayout = () => {
    const {  i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
  //  useEffect(() => {
  //     const storedLang = localStorage.getItem('language');
  //     const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    
  //     const langToUse = storedLang || browserLang;
    
  //     if (i18n.language !== langToUse) {
  //       i18n.changeLanguage(langToUse)}
    
  //     if (!storedLang) {
  //       localStorage.setItem('language', langToUse);
  //     }
  //   }, []);
    
  return (
    <div className="flex min-h-screen gap-3 mx-2 mt-2 relative"  dir={isArabic ? 'rtl' : 'ltr'}>
    <aside className="w-64 bg-gradient-to-b from-one to-two  sticky top-0 h-screen 0">
      <OrganizeationSidebar  />
    </aside>

    <div className="flex-1 flex flex-col gap-2">
      <header className="bg- bg-three rounded-[12px] shadow p-4">
        <OrganizationNavbar />
      </header>

      <main className="flex-1  p-4">
        <Outlet />
      </main>
    </div>
  </div>
  )
}


export default OrganiztionLayout
