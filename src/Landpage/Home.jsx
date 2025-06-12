import React, { useEffect , useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Nav from "./Nav";
import Earth from '../assets/Earth.png'
import phone from '../assets/phone.png'
import EasyVolunteering from '../Icons/EasyVolunteering'
import Action from "../icons/Action";
import TrustedOrganizations from '../icons/TrustedOrganizations'
import frameone from '../assets/frameone.png'
import frametwo from '../assets/frametwo.png'
import framethree from '../assets/framethree.png'
import framefour from '../assets/framefour.png'
import man from '../assets/man.png'
import { IoLogoApple } from "react-icons/io5";
import Footer from "./Footer";
const Home = () => {
const products = [
    {
      title: 'Lina A., Student Volunteer 1',
      description: "I volunteered in environmental campaigns andmade friends for life. Through VOO, I connectedwith passionate individuals who shared my visionfor a better world. Not only did I contribute tomeaningful projects, but I also gained valuable skills and experiences. VOO truly opened doors to amazing opportunities that I never thought possible!",
      sub: "Student Volunteer",
      image:man
    },
    {
      title: 'Lina A., Student Volunteer 1',
      description: "I volunteered in environmental campaigns andmade friends for life. Through VOO, I connectedwith passionate individuals who shared my visionfor a better world. Not only did I contribute tomeaningful projects, but I also gained valuable skills and experiences. VOO truly opened doors to amazing opportunities that I never thought possible!",
      sub: "Student Volunteer",
      image:man
    },
  
  ];

 const scrollRef = useRef(null);

const scroll = (direction) => {
  if (!scrollRef.current) return;

  const container = scrollRef.current;
  const scrollAmount = container.clientWidth / 2; // نصف عرض الأب

  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

     useEffect(() => {
    AOS.init({ duration: 1000, once: true,  offset: 10,  // قلل المسافة لظهور الأنميشن
 });
  }, []);
  return (
  <div className="max-w-screen  overflow-x-hidden">
      {/* nav */}
      <div className=" w-full  z-50 ">
        <Nav />
      </div>
{/* HOMW */}
    <div id="home" className=" w-screen h-fit flex flex-col md:flex-row gap-3 lg:gap-6  pb-5 lg:pb-30 px-6 lg:px-20 overflow-hidden">
  <div className="flex flex-col  gap-10 flex-1 pt-5 " data-aos="fade-right">
    <span className="font-normal  judson-regula text-3xl sm:text-4xl leading-relaxed lg:text-6xl text-landone"
     data-aos="slide-right"
     >
Make impact in a tap
— Join VOO <span className="text-landthree">!</span>   </span>
    <p className="   open-sans-regular font-normal text-base sm:text-lg lg:text-[24px] text-landseven" data-aos="slide-up">
Find volunteering opportunities that fit your passion and schedule. Let's go through – one tap is all it takes to do good and make a difference. Download now and be part of the change.    </p>

<div>
    <span className="font-semibold  judson-regula  text-[16px] lg:text-[20px] text-one"
     data-aos="slide-right"
     >
Download VOO and get started today.  </span>
</div>
    <div className="flex justify-center lg:justify-start w-full gap-2 Lg:gap-5 mt-2 lg:mt-6" data-aos="zoom-in-up">
    <button 
  onClick={() => window.open("https://apps.apple.com/eg/app/voo-volunteering/id6746558761", "_blank")}
  className="text-base sm:text-lg w-[165px] md:w-[200px] h-[60px] lg:h-[72px] bg-landone rounded-[12px] text-white transition hover:bg-gradient-to-b from-landsix to-landone hover:scale-95"
>
  Download App Store
</button>

      <button  onClick={() => window.open("https://play.google.com/store/apps/details?id=com.wego.voo", "_blank")}
       className="text-base sm:text-lg  w-[165px] md:w-[200px]  h-[60px] lg:h-[72px] border border-landone rounded-[12px] text-landone transition hover:scale-95">
Download Google Play      </button>
    </div>
  </div>

  <div className="flex-1 hidden md:flex  justify-center relative   lg:mt-10" data-aos="zoom-out-right">
    <img className=" w-full min-w-[250px]    max-w-[800px] absolute z-10 " src={Earth} alt="Earth " />
    <img className=" w-full min-w-[250px] max-w-[500px] absolute z-20 " src={phone} alt="phone " />
  </div>

  <div className="flex-1 flex md:hidden   justify-center relative items-center  mt-65 mb-20" data-aos="zoom-out-right">
    <img className=" w-full min-w-[250px]    max-w-[800px]  " src={Earth} alt="Earth " />
    <img className=" w-full min-w-[250px] max-w-[500px] absolute z-20  " src={phone} alt="phone " />
  </div>
</div>

{/* boxs */}
      <div className="w-screen py-10 px-2 flex bg-landfour gap-5 open-sans-regular justify-evenly "      data-aos="fade-up"
>
        <div className="flex flex-col gap-2  ">
          <p className=" text-[32px] text-white text-center  font-semibold">+10,000 </p>
          <p className="text-white text-center text-[10px] font-normal">Volunteers making a difference every day </p>
        </div>
        <div className="flex flex-col gap-2  ">
           <p className=" text-[32px] text-white text-center font-normal">+500 </p>
          <p className="text-white text-center text-[10px] font-semibold">Causes in education, healthcare, and more</p>
        </div>    
        <div className="flex flex-col gap-2  ">
          <p className=" text-[32px] text-white  text-center  font-normal">+1,000 </p>
          <p className="text-white text-center text-[10px] font-semibold"> Hours volunteered every month.</p>
        </div>    
      </div>

      {/* Why VOO is the Perfect Choic ? */}
      <div id="WhyVOO" className="w-screen bg-white p-10 md:p-20 lg:p-30 mx-auto ">

          <div  className="  mx-auto bg-landfive" data-aos="zoom-in">
        <p
          className="text-start md:text-center judson-regular  pt-10 px-5  w-full font-normal text-landone text-[32px] lg:text-[48px]"
          
        >
       Why VOO is the Perfect Choic ?{" "}
        </p>
        <p
          className="text-start md:text-center open-sans-regular font-normal px-3 text-landsix text-[16px] lg:text-[24px] my-2"
          data-aos="fade-up"
        >
        Make an impact with VOO discover trusted causes  and volunteer in just a tap!
        </p>
        <div className=" flex flex-wrap justify-center gap-4 "  data-aos="zoom-in">
          {/*  */}

          <div className="w-100 h-100  flex flex-col gap-2 items-center justify-center p-2">
<EasyVolunteering/>

            <p
              className=" judson-regular text-center w-full font-normal text-landone text-[32px]"
              data-aos="zoom-in-up"
            >
          Easy Volunteering{" "}
            </p>
            <p
              className=" font-normal open-sans-regular text-center text-landsix text-[20px] my-5"
              data-aos="fade-up"
            >
             All opportunities are at your fingertips.
            </p>
          </div>
          <div className="w-100 h-100  flex flex-col gap-2 pt-6 items-center justify-center p-2"  data-aos="zoom-in">
   <Action/>
            <p
              className="judson-regular text-center w-full font-normal text-landone text-[32px]"
              data-aos="zoom-in-up"
            >
               Instant Action{" "}
            </p>
            <p
              className=" font-normal text-center open-sans-regular  text-landsix text-[20px] my-5"
              data-aos="fade-up"
            >
              {" "}
             Choose a cause and start volunteering.
            </p>
          </div>
          <div className="w-100 h-100  flex flex-col gap-2  pt-12 items-center justify-center p-2">
     <TrustedOrganizations/>

            <p
              className="  judson-regular text-center w-full font-normal text-landone text-[32px]"
              data-aos="zoom-in-up"
            >
              Our Values{" "}
            </p>
            <p
              className=" font-normal  text-center open-sans-regular text-landsix text-[20px] my-5"
              data-aos="fade-up"
            >
              {" "}
        Only verified and reliable causes.
            </p>
          </div>
        </div>
      </div>
            </div>
{/* About VOO */}

  <div id="About" className=" w-screen h-fit flex flex-col lg:flex-row gap-3 lg:gap-6    px-6 lg:px-20 overflow-hidden">
  <div className="flex flex-col min-w-1/2 max-w-full   gap-2 flex-1  " data-aos="fade-right">
    <span className="font-normal  judson-regula text-3xl sm:text-4xl leading-relaxed lg:text-6xl text-landone"
     data-aos="slide-right"
     >
About VOO    </span>
<span className="font-semibold  judson-regula  text-[16px] lg:text-[20px] text-landone"
     data-aos="slide-right"
     >
Empowering Volunteers. Creating Impact. </span>
    <p className="   open-sans-regular font-normal text-base sm:text-lg lg:text-[24px] text-landsix" data-aos="slide-right">
VOO makes it easy to give back and create a positive
impact by connecting you with trusted organizations
and volunteer opportunities in education, healthcare,
and the environment.</p>
    <p className="   open-sans-regular font-normal text-base sm:text-lg lg:text-[24px] text-landseven" data-aos="slide-right">
VOO makes it easy to give back and create a positive
impact by connecting you with trusted organizations
and volunteer opportunities in education, healthcare,
and the environment.</p>

<div>
    
</div>
   <div className="flex  justify-center lg:justify-start w-full gap-2 Lg:gap-5 mt-2 lg:mt-6" data-aos="zoom-in-up">
      <button  onClick={() => window.open("https://apps.apple.com/eg/app/voo-volunteering/id6746558761", "_blank")}
 
      className="text-base sm:text-lg  w-[200px] md:w-[300px]  h-[60px] lg:h-[72px] bg-landone rounded-[12px] text-white transition hover:bg-gradient-to-b from-landsix to-landone hover:scale-95">
Download App Store      </button>
      <button onClick={() => window.open("https://play.google.com/store/apps/details?id=com.wego.voo", "_blank")}
       className="text-base sm:text-lg  w-[200px] md:w-[300px]  h-[60px] lg:h-[72px] border border-landone rounded-[12px] text-landone transition hover:scale-95">
Download Google Play      </button>
    </div>
  </div>

  <div className=" min-w-1/2 max-w-full  flex-col gap-5 flex items-center justify-start  lg:justify-center  " data-aos="zoom-out-right">
  <div className="flex  gap-3 items-center">
    <img className="  w-[156px] h-[112px] md:w-[200px] md:h-[140px] lg:w-[250px] lg:h-[180px]    xl:w-[312px] xl:h-[213px]  " src={frameone} alt="Earth " />
    <img className="   w-[156px] h-[112px] md:w-[200px] md:h-[140px] lg:w-[250px] lg:h-[180px]    xl:w-[312px] xl:h-[213px] " src={frametwo} alt="phone " />
    </div>
      <div className="flex  gap-3 items-center">
    <img className="  w-[156px] h-[112px] md:w-[200px] md:h-[140px] lg:w-[250px] lg:h-[180px]    xl:w-[312px] xl:h-[213px]" src={framethree} alt="phone " />
    <img className="  w-[156px] h-[112px] md:w-[200px] md:h-[140px] lg:w-[250px] lg:h-[180px]    xl:w-[312px] xl:h-[213px]" src={framefour} alt="phone " />
  </div>
  </div>


</div>
{/* What Volunteers Say */}
<div
  id="About"
  className="w-screen h-fit flex flex-col-reverse lg:flex-row justify-center items-center gap-2 mt-15 pt-15 lg:gap-6 bg-landfive px-2 lg:px-20"
>
  {/* الجانب الأيسر - السلايدر */}
  <div className="w-full lg:w-1/2 relative flex items-center justify-center  p-4 lg:p-8 overflow-visible" data-aos="zoom-out-right">
    <div className="w-full relative">
      {/* Cards Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth space-x-4 px-10 py-4 no-scrollbar"
      >
        {products.map((pro, idx) => (
          <div
            key={idx}
            className="relative flex flex-col pt-30 lg:pt-45 min-w-[320px] md:min-w-[720px] max-h-140 md:max-h-125 rounded-[12px] bg-gradient-to-b from-[#730FC9] to-[#6010A5] text-white p-2 overflow-hidden"
          >
            {/* Quote Mark */}
            <div className="absolute  bottom-50 md:bottom-20 text-white">
              <span className="text-[200px]">“</span>
            </div>

            {/* Testimonial Text */}
            <p className="text-[16px] text-start px-3 font-[Open Sans]">
              {pro.description}
            </p>

            <div className="w-full px-4 my-3 border text-center bg-white opacity-50" />

            {/* Author Section */}
            <div className="flex items-center gap-4 w-[385px]">
              {/* Author Image */}
              <div className="w-[72px] rounded-full bg-white bg-center bg-cover">
                <img
                  src={pro.image}
                  alt="Author"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Author Info */}
              <div className="flex flex-col gap-1 my-2">
                <h4 className="text-[20px] leading-[30px] capitalize font-['Judson']">
                  {pro.title}
                </h4>
                <p className="text-[16px] leading-[24px] text-[#E0CFEE] capitalize font-['Open Sans']">
                  {pro.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 bottom-0-4 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 p-2 rounded-full z-10"
      >
        ›
      </button>
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 bottom-0-4 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 p-2 rounded-full z-10"
      >
        ‹
      </button>
    </div>
  </div>

  {/* الجانب الأيمن - النص */}
  <div className="w-full lg:w-1/2 px-4 md:px-0">
    <div className="w-[40%] h-[16px] rounded-[12px] bg-gradient-to-b from-[#FFE782] to-[#FFCE02]"></div>
    <p
      className="judson-regular text-[32px]  lg:text-[64px] text-landone font-normal mt-5"
      data-aos="zoom-in-up"
    >
      What Volunteers Say About us !{" "}
    </p>
    <p
      className="judson-regular text-[15px] lg:text-[24px] text-landsix font-normal mt-5"
      data-aos="zoom-in-up"
    >
      Real stories from changemakers who started their journey with VOO. Join
      a growing community of passionate, impact-driven volunteers.{" "}
    </p>
    <div className="w-full mt-4 flex justify-end">
      <div className="w-[40%] h-[16px] rounded-[12px] bg-gradient-to-b from-[#730FC9] to-[#6010A5]"></div>
    </div>
  </div>
</div>


{/* Ready to Make a Real Impact? */}
<div className="bg-white p-4 md:p-10 lg:p-30">

<div className="w-full  h-screen  flex justify-center items-center px-2 md:px-10 lg:px-20 gap-5 flex-col bg-landfive" data-aos="zoom-in-down" >
  <span className="font-normal text-landone text-[32px] lg:text-[64px]">Ready to Make a Real Impact?</span>
  <span className="font-normal text-landsix  text-[15px] lg:text-[24px]">Join thousands already volunteering with VOO. Let's go through and be
part of the change. Download now and make a difference.</span>
<div className="flex flex-wrap justify-center w-full gap-2 Lg:gap-5 mt-2 lg:mt-6" data-aos="zoom-in-up">
  
  <button className="flex gap-3 min-w-[250px] bg-landone rounded-[12px] items-center text-white p-3">
<i><IoLogoApple className=" text-5xl"/></i>
<button  onClick={() => window.open("https://apps.apple.com/eg/app/voo-volunteering/id6746558761", "_blank")}
 className="flex flex-col items-center justify-center">
  <p className=" text-2xl lg:text-3xl">Download on the</p>
  <p className="text-[20px] lg:text-2xl">Google Play</p>
</button>
  </button>

   <button className="flex gap-3 min-w-[250px] bg-landone rounded-[12px] items-center text-white p-3">
<svg width="49" height="57" viewBox="0 0 49 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.8779 27.2439L0.209045 51.8472C0.211175 51.8515 0.211174 51.858 0.213303 51.8624C0.909529 54.5339 3.29415 56.5 6.1259 56.5C7.25859 56.5 8.32103 56.1865 9.2323 55.6378L9.30469 55.5943L34.8202 40.5384L22.8779 27.2439Z" fill="#EA4335"/>
<path d="M45.8105 23.0545L45.7892 23.0393L34.7731 16.5096L22.3624 27.8032L34.8178 40.5359L45.7743 34.0715C47.6947 33.009 48.9999 30.9384 48.9999 28.5521C48.9999 26.1789 47.7139 24.1192 45.8105 23.0545Z" fill="#FBBC04"/>
<path d="M0.208655 5.15084C0.0723904 5.66467 0 6.20464 0 6.76202V50.2379C0 50.7953 0.0723904 51.3353 0.210784 51.8469L23.6568 27.8729L0.208655 5.15084Z" fill="#4285F4"/>
<path d="M23.0452 28.5L34.7767 16.5054L9.29105 1.39507C8.36488 0.826796 7.28329 0.500206 6.12717 0.500206C3.29543 0.500206 0.906544 2.47064 0.210319 5.14434C0.210319 5.14651 0.208191 5.14869 0.208191 5.15087L23.0452 28.5Z" fill="#34A853"/>
</svg>
<button  
 onClick={() => window.open("https://play.google.com/store/apps/details?id=com.wego.voo", "_blank")}
 className="flex flex-col items-center justify-center">
  <p className="text-2xl lg:text-3xl">Download on the</p>
  <p className="text-[20px] lg:text-2xl ">App Store</p>
</button>
  </button>

</div>
</div>
</div>

{/* 
Let’s Connect! */}
<div  id='Contact'className="w-screen h-fit flex flex-col relative lg:flex-row justify-center items-center gap-2 mt-15 pt-15 lg:gap-6  px-2 lg:px-20 overflow-hidden">
  <div className="bg-landfive absolute w-[70%] h-screen left-0 z-0 "></div>
  <div className="w-full lg:w-1/2 px-4 md:px-0 z-10">
    <div className="w-[40%]  h-[16px] rounded-[12px] bg-gradient-to-b from-[#FFE782] to-[#FFCE02]"></div>
    <p
      className="judson-regular text-[32px]  lg:text-[64px] text-one font-normal mt-5"
      data-aos="zoom-in-up"
    >
    Let’s Connect!{" "}
    </p>
    <p
      className="judson-regular text-[15px] lg:text-[24px] text-landsix font-normal mt-5"
      data-aos="zoom-in-up"
    >
    We’d love to hear from you! Have questions,
suggestions, or need help? Fill out the form
below, and we’ll get back to you as soon as
possible.{" "}
    </p>
    
    <div className="w-full mt-4 flex justify-end p-1">
      <div className="w-[40%] h-[16px] rounded-[12px] mt-15  bg-gradient-to-b from-[#730FC9] to-[#6010A5]"></div>
    </div>
  </div>

   <div className="w-full lg:w-1/2 flex flex-col h-150 rounded-[12px] z-10  bg-[#730FC9] items-center justify-center px-6 pt-2 lg:px-10">
      
  
      <div className="w-full flex gap-4 flex-col judson-bold " data-aos="zoom-out">
        <input type="text" placeholder="Your Name" className="w-full rounded-3xl bg-white p-3 border mb-2" />
        <input type="email" placeholder="Your Email" className="w-full  bg-white rounded-3xl p-3 border mb-2" />
          <textarea placeholder="Message" className="w-full rounded-3xl  bg-white p-3 border h-24 resize-none" />
      </div>
      <button className="bg-[#FFCE02] px-5 py-2 text-white text-[24px] font-normal rounded-3xl hover:scale-90 delay-100 transform transition ease-in w-full mt-6 mb-2">Send Message</button>
    </div>
  
</div>
<Footer/>
    </div>
  )
}

export default Home