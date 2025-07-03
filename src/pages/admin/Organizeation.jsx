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
import * as XLSX from "xlsx"; 
import { FaDownload } from "react-icons/fa";

const Organizeation = () => {
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
    axios.get("https://backndVoo.voo-hub.com/api/admin/organization", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.orgnization);
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
        axios.delete(`https://backndVoo.voo-hub.com/api/admin/organization/delete/${userId}`, {
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

  
  const handleEdit = (id) => {
    navigate('/admin/addorganizeation', { state: { sendData: id } });
  };
 const filteredData = data.filter((item) => {
   const query = searchQuery.toLowerCase();
 
   if (selectedFilter === "Filter" || selectedFilter === "") {
     return Object.values(item).some(value =>
       typeof value === "object"
         ? Object.values(value || {}).some(sub =>
             sub?.toString().toLowerCase().includes(query)
           )
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
    const cheose = ["Filter", "name", "phone", "email", "country.name", "city.name"];
  const labelMap = {
    Filter: "Filter",
    name: "organization",
    phone: "phone",
    email: "Gmail",
    "country.name": "Country",
    "city.name": "City",
      
  };
  const changestutes = (id, newStatus) => {
  const token = localStorage.getItem('token');

  axios.put(
    `https://backndVoo.voo-hub.com/api/admin/user/status/${id}`,
    { account_status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .then(() => {
            setUpdate(!update);
            toast.success("updated Status")
  })
 
};
//  Export filtered data to Excel
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((d, index) => ({
          SL: index + 1,
          Name: d.name || "-",
          Email: d.email || "-",
          Phone: d.phone || "-",
          City: d.city?.name || "-",
          Country: d.country?.name || "-",
          Total_hours: d.total_hours || "-",
          Total_events: d.total_events || "-",
          Total_tasks: d.total_tasks || "-",
          Account_status: d.account_status || "-",
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "VooOrganizeation");
      XLSX.writeFile(workbook, "VooOrganizeation.xlsx");
};
const truncateText = (text, maxLength = 15) => {
  if (!text) return "N/A";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
  return (
 <div>
      <div className='flex justify-between items-center'>
          <div className='relative items-center'>
            <input
              placeholder='Search'
              className='min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CiSearch className='w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6' />
          </div>
          <button onClick={()=> exportToExcel()} className='p-2 bg-one text-white rounded-[10px] animate-pulse flex gap-2 items-center '>
                    <span>Export To Excel</span>
                    <i><FaDownload/></i>
                  </button>
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
                className='flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1'
              >
                {cheose.map((option, index) => (
                  <option key={index} value={option}>
                    {labelMap[option] || option}
                  </option>
                ))}
              </select>
            </button>
           <button onClick={() => navigate('/admin/addorganizeation')}
                    className='flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1'>
                     <FaPlus className='text-one w-4 h-4 md:w-6 md:h-6' />
                     <span className='text-[16px] md:text-[20px] font-medium text-one'>Add</span>
                   </button>
          </div>
        </div>
 
<div className="mt-10 block text-left">
  <div className="min-w-[800px]">
            <table className="w-full border-y border-x border-black">
          <thead className="w-full">
            <tr className='bg-four '>
              <th className="py-4 px-3">S/N</th>
              <th className="py-4 px-3">Organization</th>
              <th className="py-4 px-3">Gmail</th>
              <th className="py-4 px-3">Country</th>
              <th className="py-4 px-3">City</th>
              <th className="py-4 px-3">join date</th>
               <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3">Details</th>
              <th className="py-4 px-3">Action</th>
         </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.id} className='border-y hover:border-3 relative hover:bg-four'>
                <td className=" font-bold lg:text-[12px] xl:text-[12px] py-2 px-3">
                {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
  <td className="py-2 px-3 text-[12px]">
  <div className="flex flex-col justify-center">
      <span>{truncateText(item?.name)}</span>
      <span>{truncateText(item?.phone)}</span>
    </div>
  </td>
 <td className="py-2 px-3">
    {truncateText(item?.email)}
  </td>

  <td className="py-2 px-3">
    {truncateText(item?.country?.name)}
  </td>

  <td className="py-2 px-3">
    {truncateText(item?.city?.name)}
  </td>
 <td className="py-2 px-3 ">
{item?.created_at ? new Date(item.created_at).toISOString().split('T')[0] : "N/A"}  </td>

  <td className="py-2 px-3 text-six">
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={item.account_status === 'active'}
      onChange={() => {
        const newStatus = item.account_status === 'active' ? 'inactive' : 'active';
        changestutes(item.id, newStatus);
      }}
    />
    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition">
      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
    </div>
    <span className="ml-2 text-sm">
      {item.account_status === 'active' ? 'Active' : 'Inactive'}
    </span>
  </label>
</td>

  <td className="py-2 px-3 text-[12px] align-middle">
  <button className='underline ' onClick={() => navigate('/admin/organizeationdatali', { state: { sendData: item.id } })}>
   Details
</button>

    </td>
                <td className=" h-[56px] lg:text-[12px] xl:text-[16px] flex justify-start items-center">
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

export default Organizeation
