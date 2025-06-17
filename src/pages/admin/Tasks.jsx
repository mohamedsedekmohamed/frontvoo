import React, { useEffect, useState } from 'react';
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import filter from '../../assets/filter.svg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from '@mui/material/Pagination';

const Tasks = () => {
  const [data, setData] = useState([]);
   const [update, setUpdate] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedFilter, setSelectedFilter] = useState('');
   const navigate = useNavigate();
   
     useEffect(() => {
       setCurrentPage(1);
     }, [searchQuery]);
   
   useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/admin/task", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.tasks);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };
  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem('token');

    Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://backndVoo.voo-hub.com/api/admin/task/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setUpdate(!update);
            Swal.fire('Deleted!', `${userName} has been deleted successfully.`, 'success');
          })
          .catch(() => {
            Swal.fire('Error!', `There was an error while deleting ${userName}.`, 'error');
          });
      } else {
        Swal.fire('Cancelled', `${userName} was not deleted.`, 'info');
      }
    });
  };
   const [selectedDate, setSelectedDate] = useState('');
  
    const handleChangedata = (e) => {
      setSelectedDate(e.target.value); // value هي بصيغة YYYY-MM-DD
    };
  
  
  const handleEdit = (id) => {
    navigate('/admin/addtasks', { state: { sendData: id } });
  };
    const filteredData = data.filter((item) => {
      const query = searchQuery.toLowerCase();
  
      if (selectedFilter === "Filter" || selectedFilter === "") {
        return Object.values(item).some(value =>
          typeof value === "object"
            ? Object.values(value).some(sub => sub?.toString().toLowerCase().includes(query))
            : value?.toString().toLowerCase().includes(query)
        );
      } else {
        const keys = selectedFilter.split(".");
        let value = item;
        for (let key of keys) {
          value = value?.[key];
        }
  
        return value?.toString().toLowerCase().includes(query);
      }
    });
    
      const [currentPage, setCurrentPage] = useState(1);
      const rowsPerPage = 10;
      const pageCount = Math.ceil(filteredData.length / rowsPerPage);
      const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );
    const cheose = ["Filter", "name","date","time","description"];
    const labelMap = {
      Filter: "Filter",
      name: "task",
      date:"date",
      start_time:"time",
      description:"description"
    };
  
  return (
    <div>
 
     <div className='flex justify-between items-center'>
            <div className='relative items-center'>
              <input
                placeholder='Search'
                className='w-[100px] md:min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CiSearch className='w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6' />
            </div>
            <div className="flex items-center gap-4 my-4">
  <input
    type="date"
    value={selectedDate}
    onChange={handleChangedata}
    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>
            <div className='flex gap-2'>
              <button className='flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1'>
                <img src={filter} className='text-white w-4 h-4 md:w-6 md:h-6' />
                <select
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: '20px',
                    backgroundImage: 'none',
                  }}
                  value={selectedFilter}
                  onChange={handleChange}
                  className='flex justify-center w-15 md:w-20 text-[10px] md:text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1'
                >
                  {cheose.map((option, index) => (
                    <option key={index} value={option}>
                      {labelMap[option] || option}
                    </option>
                  ))}
                </select>
              </button>
               <button onClick={() => navigate('/admin/addtasks')}
                      className='flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1'>
                       <FaPlus className='text-one w-4 h-4 md:w-6 md:h-6' />
                       <span className='text-[16px] md:text-[20px] font-medium text-one'>Add</span>
                     </button>
            </div>
          </div>



    <div className="mt-10 hidden lg:block">
         <table className="w-full border-y border-x border-black">
           <thead className="w-full">
             <tr className='bg-four w-[1012px] h-[56px]'>
               <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">S/N</th>
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Event</th>
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Date</th>
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Time</th>
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Description</th>
        
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Details</th>
               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Operation</th>

               <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Action</th>
             </tr>
           </thead>
           <tbody>
             {paginatedData.map((item, index) => (
               <tr key={item.id} className='border-y hover:border-3 relative hover:bg-four'>
                 <td className="w-[30px] h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                 {(currentPage - 1) * rowsPerPage + index + 1}
                 </td>
                 <td className="w-[160px] h-[56px] lg:text-[14px] xl:text-[12px]">{item?.name ?? "N/A"}</td>
                 <td className="w-[160px] h-[56px] lg:text-[14px] xl:text-[12px]">{item?.date ?? "N/A"}</td>
                 <td className="w-[160px] h-[56px] lg:text-[10px] xl:text-[12px]">{item?.start_time ?? "N/A"} </td>
                 <td className="w-[160px] h-[56px] lg:text-[14px] xl:text-[12px]">{item?.description ?? "N/A"}</td>
                 <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
  <button className='underline ' onClick={() => navigate('/admin/tasksDetails', { state: { sendData: item.id } })}>
   Details
</button>
    </td>
    <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
  <button className='underline ' onClick={() => navigate('/admin/operationTasks', { state: { sendData: item.id } })}>
  operation
</button>

    </td>
            
    
                 <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[12px] flex justify-start items-center">
                   <CiEdit
                     className="w-[24px] h-[24px] text-six cursor-pointer"
                     onClick={() => handleEdit(item.id)}
                   />
                   <RiDeleteBin6Line
                     className="w-[24px] h-[24px] ml-2 text-five cursor-pointer"
                     onClick={() => handleDelete(item.id, item.name)}
                   />
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

        <div className="lg:hidden mt-6 mx-auto space-y-4 w-75">
             {paginatedData.map((item,index) => (
               <div key={item.id} className="border rounded-md relative p-4 shadow-sm">
                 <p className="text-sm text-right absolute top-1 right-1">           {(currentPage - 1) * rowsPerPage + index + 1}
                 </p>
                 <h3 className="text-lg font-semibold">{item?.name ?? "N/A"}</h3>
                 <p className="text-sm">📅 {item?.date ?? "N/A"}</p>
                 <p className="text-sm">⏰ Start: {item?.start_time ?? "N/A"}</p>
                 <p className="text-sm">📍 {item?.description ?? "N/A"}</p>
                 <div className="flex justify-between mt-3">
                   <button onClick={() => navigate('/admin/tasksDetails', { state: { sendData: item.id } })} className="text-gray-950 underline text-sm">
                     Details
                   </button>
                   <button onClick={() => navigate('/admin/operationTasks', { state: { sendData: item.id } })} className="text-gray-950 underline text-sm">
                     Operation
                   </button>
                   <div className="flex gap-2">
                     <CiEdit className="text-six cursor-pointer" onClick={() => handleEdit(item.id)} />
                     <RiDeleteBin6Line className="text-five cursor-pointer" onClick={() => handleDelete(item.id, item.name)} />
                   </div>
                 </div>
               </div>
             ))}
           </div>
        <div className="flex justify-center mt-4">
               <Pagination
                 count={pageCount}
                 page={currentPage}
                 onChange={(e, page) => setCurrentPage(page)}
                 color="secondary"
                 shape="rounded"
               />
             </div>
       <ToastContainer />
     </div>
  )
}

export default Tasks
