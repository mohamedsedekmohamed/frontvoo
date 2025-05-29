import React from 'react'
import { FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";import BarChart from "../../ui/BarChart"
import { FaTableCells } from "react-icons/fa6";
import { VscCheck } from "react-icons/vsc";
import { RxLapTimer } from "react-icons/rx";

const Home = () => {

  const items = [
  { text: 'First line', color: 'bg-red-500' },
  { text: 'Second line', color: 'bg-blue-500' },
  { text: 'Third line', color: 'bg-green-500' },
  { text: 'Fourth line', color: 'bg-yellow-500' },
  { text: 'Fifth line', color: 'bg-purple-500' },
  { text: 'Sixth line', color: 'bg-orange-500' },
];

 
  return (
    <div className='w-full mt-6 '>
      {/* boxs */}
  <div class="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2 h-full mx-5">
    {/* one */}
<div className='w-[23%} h-[159px] bg-threeteen  text-three flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><FaUsers className='text-three'/></i><span>Active Volunteers    </span> </div>
  <span className='text-2xl'> 100</span>
</div>
{/* two */}
<div className='w-[23%} h-[159px] bg-fourteen  text-one flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl items-center'><i><FaTableCells active/></i><span>Current Tasks </span> </div>
  <span className='text-2xl'> 100</span>
</div>

{/* threr */}

<div className='w-[23%} h-[159px] bg-threeteen text-three  text-one flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><VscCheck active/></i><span>Completed Tasks  </span> </div>
  <span className='text-2xl'> 100</span>
</div>
{/* four */}
<div className='w-[23%} h-[159px] bg-fourteen  text-one flex flex-col  gap-4 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[18px] lg:text-[20px]  items-center'><i><RxLapTimer /></i><span>Pending Tasks  </span> </div>
  <span className='text-2xl'> 100</span>
</div>
</div>
<div>
<BarChart/>
</div>
<div className='bg-threeteen w-[95%] mt-10 mx-[10px] '>
  <div className='flex items-center text-three gap-1  text-[18px] md:text-2x1 lg:text-3xl'> 
<i><FaLocationDot/> </i>
<h2 className='p-3 text-three'>Top cities by request volume</h2>
  </div>
</div>
 <div className="space-y-2 p-4 bg-white rounded shadow-md">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
          <span className="text-gray-800">{item.text}</span>
        </div>
      ))}
    </div>
    </div>
  )}
export default Home;