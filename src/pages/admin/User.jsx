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

const User = () => {
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
    axios.get("https://backndVoo.voo-hub.com/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.users);
        console.log(response.data.users);
      })
      .catch(() => {
        toast.error("Error fetching data");
        console.log(token)
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
        axios.delete(`https://backndVoo.voo-hub.com/api/admin/user/delete/${userId}`, {
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
    navigate('/admin/addUser', { state: { sendData: id } });
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
  
  const cheose = ["Filter", "name", "email", "phone", "country.name", "city.name", "account_status"];
  const labelMap = {
    Filter: "Filter",
    name: "User",
    email: "Email",
    phone: "Phone",
    "country.name": "Country",
    "city.name": "City",
    "account_status": "status",
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
const changestutes = (id, newStatus) => {
  const token = localStorage.getItem('token');

  axios.put(
    `https://backndVoo.voo-hub.com/api/admin/organization/status/${id}`,
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
          country: d.country?.name || "-",
          total_hours: d.total_hours || "-",
          total_events: d.total_events || "-",
          total_tasks: d.total_tasks || "-",
          Account_status: d.account_status || "-",
          
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Voousers");
      XLSX.writeFile(workbook, "Voousers.xlsx");
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
          <button onClick={() => navigate('/admin/addUser')}
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
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left pl-3">User</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Gmail</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Country</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">City</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Details</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Orgnization</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Status</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Action</th>
            </tr>
          </thead>
      <tbody>
  {paginatedData.map((item, index) => (
    <tr key={item.id} className='border-y border-x hover:border-3 relative hover:bg-four h-[56px]'>

      <td className="w-[30px] text-[12px] text-left align-middle px-3 font-bold">
        {(currentPage - 1) * rowsPerPage + index + 1}
      </td>

      <td className="w-[143px] text-[12px] align-middle px-3">
        <div className="flex flex-col justify-center">
          <span>{item?.name ?? "N/A"}</span>
          <span>{item?.phone ?? "N/A"}</span>
        </div>
      </td>

      <td className="w-[160px] text-[12px] align-middle px-3">
        {item?.email ?? "N/A"}
      </td>

      <td className="w-[143px] text-[12px] align-middle px-3">
        {item?.country?.name ?? "N/A"}
      </td>

      <td className="w-[143px] text-[12px] align-middle px-3">
        {item?.city?.name ?? "N/A"}
      </td>

      <td className="w-[143px] text-[12px] align-middle px-3">
        <button
          className='underline'
          onClick={() => navigate('/admin/userdetails', { state: { sendData: item.id } })}
        >
          Details
        </button>
      </td>

      <td className="w-[143px] text-[12px] align-middle px-3 font-medium">
        {item?.orgnization?.name ?? "N/A"}
      </td>
<td className="w-[143px] text-[12px] align-middle  text-six">
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



      <td className="w-[143px] text-[12px] align-middle px-3">
        <div className="flex items-center">
          <CiEdit
            className="w-[24px] h-[24px] text-six cursor-pointer"
            onClick={() => handleEdit(item.id)}
          />
          <RiDeleteBin6Line
            className="w-[24px] h-[24px] ml-2 text-five cursor-pointer hover:text-red-600 transition"
            onClick={() => handleDelete(item.id, item.name)}
          />
        </div>
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
  );
};

export default User;
