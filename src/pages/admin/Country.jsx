import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import filter from '../../assets/filter.svg'
const Country = () => {
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();

  return (
    <div className='flex justify-between items-center  '>
      <div className='relative items-center '>
        <input
              placeholder='Search'
              className='min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
             <CiSearch className='w-4 h-4 md:w-6 text-three font-medium absolute left-2  top-3 md:h-6' />
              </div>
              <div className='flex gap-2'>
        <button  className=' flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1 '>
        <img src={filter}  className='text-white w-4 h-4 md:w-6 md:h-6'/>
    <span className='text-[16px] md:text-[20px] font-medium text-white '>filter</span>
        </button>
     <button onClick={() => navigate('/admin/addcountry')} className=' flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1 '>
        <FaPlus  className='text-white w-4 h-4 md:w-6 md:h-6'/>
    <span className='text-[16px] md:text-[20px] font-medium text-white '>Add</span>
        </button>
              </div>

    </div>
  )
}

export default Country
