import React from 'react'
import footerloge from '../assets/footerloge.png'
import { IoLogoApple } from "react-icons/io5";

 const Footer = () => {
  return (
<footer className="  bg-landone mt-5 "  data-aos="fade-down-left">
    {/* Contact Us */}
 
  <div className="text-white py-10 px-6 lg:px-10 w-full bg-landone  ">
  <div className="max-w-7xl mx-auto grid grid-cols-1  lg:grid-cols-3 gap-y-10 gap-x-16">

    {/* Logo / Brand */}
    <div>
      <img src={footerloge} alt="logo" className="mb-4"/>
      <p className="text-[16px] font-normal leading-relaxed">
        Volunteering made simple — connect, contribute, and create real impact.
      </p>
    </div>

    {/* Quick Links */}

    <div className=' flex justify-evenly'>
    <div>
      <h3 className="font-semibold text-xl mb-3">Quick Links</h3>
      <ul className="space-y-3 text-[14px]">
        <li><a href="/" className="hover:underline flex items-center gap-2">&gt; Home</a></li>
        <li><a onClick={() => document.getElementById("Services")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer hover:underline flex items-center gap-2">&gt; Our Services</a></li>
        <li><a onClick={() => document.getElementById("About")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer hover:underline flex items-center gap-2">&gt; About Us</a></li>
      </ul>
    </div>

    {/* Follow Us */}
    <div>
      <h3 className="font-semibold text-xl mb-3">Follow Us</h3>
      <ul className="space-y-3 text-[14px]">
        <li><a href="#" className="hover:underline flex items-center gap-2">&gt; Instagram</a></li>
        <li><a href="#" className="hover:underline flex items-center gap-2">&gt; Twitter</a></li>
        <li><a href="#" className="hover:underline flex items-center gap-2">&gt; Facebook</a></li>
        <li><a href="#" className="hover:underline flex items-center gap-2">&gt; LinkedIn</a></li>
      </ul>
    </div>
    </div>

    {/* App Download Buttons */}
    <div className="flex flex-col gap-4 w-full max-w-xs">
      {/* Apple */}
      <button className="flex gap-3 bg-black rounded-[12px] items-center text-white p-4">
        <IoLogoApple className="text-4xl" />
        <button   onClick={() => window.open("https://apps.apple.com/eg/app/voo-volunteering/id6746558761", "_blank")}
         className="flex flex-col items-start justify-center">
          <p className="text-sm">Download on the</p>
          <p className="text-lg font-semibold">App Store</p>
        </button>
      </button>

      {/* Google */}
      <button className="flex gap-3 bg-black rounded-[12px] items-center text-white p-4">
        {/* Google Play SVG */}
       
<svg width="49" height="57" viewBox="0 0 49 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.8779 27.2439L0.209045 51.8472C0.211175 51.8515 0.211174 51.858 0.213303 51.8624C0.909529 54.5339 3.29415 56.5 6.1259 56.5C7.25859 56.5 8.32103 56.1865 9.2323 55.6378L9.30469 55.5943L34.8202 40.5384L22.8779 27.2439Z" fill="#EA4335"/>
<path d="M45.8105 23.0545L45.7892 23.0393L34.7731 16.5096L22.3624 27.8032L34.8178 40.5359L45.7743 34.0715C47.6947 33.009 48.9999 30.9384 48.9999 28.5521C48.9999 26.1789 47.7139 24.1192 45.8105 23.0545Z" fill="#FBBC04"/>
<path d="M0.208655 5.15084C0.0723904 5.66467 0 6.20464 0 6.76202V50.2379C0 50.7953 0.0723904 51.3353 0.210784 51.8469L23.6568 27.8729L0.208655 5.15084Z" fill="#4285F4"/>
<path d="M23.0452 28.5L34.7767 16.5054L9.29105 1.39507C8.36488 0.826796 7.28329 0.500206 6.12717 0.500206C3.29543 0.500206 0.906544 2.47064 0.210319 5.14434C0.210319 5.14651 0.208191 5.14869 0.208191 5.15087L23.0452 28.5Z" fill="#34A853"/>
</svg>
        <button
        onClick={() => window.open("https://play.google.com/store/apps/details?id=com.wego.voo", "_blank")}
        className="flex flex-col items-start justify-center">
          <p className="text-sm">Download on the</p>
          <p className="text-lg font-semibold">Play Store</p>
        </button>
      </button>
    </div>

  </div>
</div>


  {/* Bottom Bar */}
  <div className=" border  mt-1 border-t bg-[#FFCE02] border-seven  font-medium py-6 pl-5 text-[12px] text-seven">
    © {new Date().getFullYear()} Powered by Wegostation
  </div>
</footer>
  )
}
export default Footer