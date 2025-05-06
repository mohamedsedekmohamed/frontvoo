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
    const cheose = ["Filter", "name", "phone", "email", "country.name", "city.name"];
  const labelMap = {
    Filter: "Filter",
    name: "organization",
    phone: "phone",
    email: "Gmail",
    "country.name": "Country",
    "city.name": "City",
      
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
   <div className="mt-10  block">
        <table className="w-full border-y border-x border-black">
          <thead className="w-full">
            <tr className='bg-four w-[1012px] h-[56px]'>
              <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">S/N</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left pl-3">organization</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Gmail</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Country</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">City</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">details</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Action</th>
         </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.id} className='border-y hover:border-3 relative hover:bg-four'>
                <td className="w-[30px] h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="flex flex-col w-[143px] absolute top-1 h-[56px] p-1 gap-1">
    <span className="lg:text-[12px] xl:text-[12px] font-normal px-1">
      {item?.name ?? "N/A"}
    </span>
    <span className="lg:text-[12px] xl:text-[12px] font-normal px-1">
      {item?.phone ?? "N/A"}
    </span>
  </td>


  <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[12px]">
    {item?.email ?? "N/A"}
  </td>
  <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[14px] px-1">
    {item?.country?.name ?? "N/A"}
  </td>
  <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[14px] px-1">
    {item?.city?.name ?? "N/A"}
  </td>
  <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
  <button className='underline ' onClick={() => navigate('/admin/organizeationdatali', { state: { sendData: item.id } })}>
   Details
</button>

    </td>
                <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px] flex justify-start items-center">
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
