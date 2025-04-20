import React from 'react'
import { FaRegBell  } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
const AdminNavbar = () => {
  return (
    <div className="flex justify-between items-center">
<div className=' flex items-center gap-3'>
  <span  className='w-10 h-10 bg-gray-200 rounded-full' />
  <h1 className='text-2xl font-bold text-white'>Hello Mr. Ahmed</h1> 
  </div> 
     <div className='flex items-center gap-3'>
      <span className='flex gap-1 items-center justify-center text-white'> <GrLanguage/> <span className='pb-1'> En</span>  <IoIosArrowDown /></span>
      <i className='text-white text-2xl'><FaRegBell  /></i>
    </div>
  </div>
  )
}

export default AdminNavbar
