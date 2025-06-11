import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Voologo from '../assets/Voologo.png'
import { IoMdLogIn } from "react-icons/io";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Why VOO?", path: "#WhyVOO" },
    { name: "About", path: "#About" },
    { name: "Contact Us", path: "#Contact" },
  ];

  function isActive(path) {
    if (!path) return false;
    return location.pathname === path;
  }

  // دالة للتمرير الناعم الى id
  const handleScroll = (e, path) => {
    e.preventDefault();

    // لو الرابط #hash
    if (path.startsWith("#")) {
      const id = path.substring(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
      return;
    }

    // لو الرابط صفحة مختلفة (مثل "/")
    setIsOpen(false);
    navigate(path);
  };

  return (
  <nav className="open-sans-light bg-white backdrop-blur z-50 w-screen shadow-md  ">
  <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-[88px]">

      {/* Logo */}
      <div className="open-sans-bold text-[20px] md:text-[20px] lg:text-[40px] z-10">
        <img src={Voologo} alt="VOO Logo" className="inline-block mr-2 my-2" />
      </div>

      {/* قائمة الديسكتوب */}
      <div className="hidden md:flex space-x-5 text-landtwo">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            onClick={(e) => handleScroll(e, link.path)}
            className={`relative md:text-[14px] lg:text-[16px] xl:text-[20px] font-normal group px-2 py-2 ${
              isActive(link.path) ? "text-landone " : ""
            }`}
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-landone transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <div className="flex items-center space-x-2">
 <button 
onClick={()=>navigate('/login')} className="px-5 py-2 bg-landone rounded-3xl text-white text-2xl font-medium flex items-center gap-1 animate-pulse">
  <IoMdLogIn />
  <p className="hidden md:block">Login</p>
</button>



        {/* زر الهامبرغر للموبايل */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

    </div>
  </div>

  {/* قائمة الموبايل */}
  {isOpen && (
    <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white backdrop-blur">
      {navLinks.map((link, i) => (
        <a
          key={i}
          href={link.path}
          onClick={(e) => handleScroll(e, link.path)}
          className={`block px-3 py-2 rounded font-normal group relative ${
            isActive(link.path)
              ? "bg-landone text-white"
              : "text-landthree/80 hover:bg-landone hover:text-white"
          }`}
        >
          {link.name}
        </a>
      ))}
    </div>
  )}
</nav>

  );
};

export default Nav;
