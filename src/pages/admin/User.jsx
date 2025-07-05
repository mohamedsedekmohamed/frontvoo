import React, { useEffect, useMemo, useState } from 'react';
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
  
    const [selectedIds, setSelectedIds] = useState([]);
const [sortKey, setSortKey] = useState('');
const [sortOrder, setSortOrder] = useState('');
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

  const cheose = ["Filter", "name","age", "email", "phone", "country.name", "city.name", ];
  const labelMap = {
    Filter: "Filter",
    name: "User",
    email: "Email",
    age: "Age",
    phone: "Phone",
    "country.name": "Country",
    "city.name": "City",
  };
  
  
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
const truncateText = (text, maxLength = 15) => {
  if (!text) return "N/A";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
const handleBulkDelete = () => {
  if (selectedIds.length === 0) return;

  Swal.fire({
    title: "Are you sure?",
    text: "This action will delete selected users!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete them!",
  }).then((result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      Promise.all(
        selectedIds.map((user) =>
          axios.delete(`https://backndVoo.voo-hub.com/api/admin/user/delete/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      )
        .then(() => {
          toast.success("Selected users deleted successfully");
          setSelectedIds([]);
          setUpdate((prev) => !prev);
        })
        .catch(() => toast.error("Error deleting some users"));
    }
  });
};

const handleBulkStatusChange = () => {
  if (selectedIds.length === 0) return;

  const token = localStorage.getItem("token");

  Promise.all(
    selectedIds.map((user) =>
      axios.put(
        `https://backndVoo.voo-hub.com/api/admin/organization/status/${user.id}`,
        {
          account_status: user.status === "active" ? "inactive" : "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    )
  )
    .then(() => {
      toast.success("Status updated for selected users");
      setSelectedIds([]);
      setUpdate((prev) => !prev);
    })
    .catch(() => toast.error("Error updating status for some users"));
};
const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const sortedData = useMemo(() => {
  let sortableData = [...filteredData];  

  if (sortKey === "no" &&  sortOrder === "no") {
    
    return sortableData; 
  }

  return sortableData.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortKey === 'age') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (sortKey === 'created_at') {
      return sortOrder === 'asc'
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    
    return 0; 
  });
}, [filteredData, sortKey, sortOrder]);


const paginatedData = sortedData.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

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
   <select
  value={sortKey}
  onChange={(e) => {
    const [key, order] = e.target.value.split(':');
    setSortKey(key);
    setSortOrder(order);
  }}
  className="text-[14px] h-9 border border-one rounded-[8px] px-2"
>
  <option value="no:no">Sort By</option>
  <option value="age:asc">Age ↑</option>
  <option value="age:desc">Age ↓</option>
  <option value="created_at:asc">Join Date ↑</option>
  <option value="created_at:desc">Join Date ↓</option>
</select>

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
  {selectedIds.length > 0 && (
  <div className="flex gap-2 mt-4">
    <button
      className="bg-one/60 text-white px-4 py-2 rounded"
      onClick={handleBulkStatusChange}
    >
      Change Status
    </button>
    <button
      className="bg-one/60 text-white px-4 py-2 rounded"
      onClick={handleBulkDelete}
    >
      Delete All
    </button>
  </div>
)}
<div className="mt-10 block text-left">
  <div className="min-w-[800px]">
            <table className="w-full border-y border-x border-black">
          <thead className="w-full">
            <tr className='bg-four '>
              <th className="py-4 px-3">S/N</th>
              <th className="py-4 px-3">User</th>
              <th className="py-4 px-3">Age</th>
              <th className="py-4 px-3">Gmail</th>
              <th className="py-4 px-3">Country</th>
              <th className="py-4 px-3">City</th>
              <th className="py-4 px-3">Details</th>
              <th className="py-4 px-3">Orgnization</th>
              <th className="py-4 px-3">join date</th>
              <th className="py-4 px-3">Status</th>
                      <th className="py-4 px-3">
<input
  type="checkbox"
  checked={
    selectedIds.length === paginatedData.length && paginatedData.length > 0
  }
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedIds(
        paginatedData.map((item) => ({
          id: item.id,
          status: item.account_status,
        }))
      );
    } else {
      setSelectedIds([]);
    }
  }}
/>

</th>
              <th className="py-4 px-3">Action</th>
            </tr>
          </thead>
      <tbody>
  {paginatedData.map((item, index) => (

<tr key={item.id} className='border-y border-x hover:border-3 relative hover:bg-four h-[56px]'>

  <td className="py-2 px-3 font-bold">
    {(currentPage - 1) * rowsPerPage + index + 1}
  </td>

  <td className="py-2 px-3 text-[12px]">
    <div className="flex flex-col justify-center">
      <span>{truncateText(item?.name)}</span>
      <span>{truncateText(item?.phone)}</span>
    </div>
  </td>

  <td className="py-2 px-3">
    {truncateText(item?.age)}
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

  <td className="py-2 px-3">
    <button
      className='underline'
      onClick={() => navigate('/admin/userdetails', { state: { sendData: item.id } })}
    >
      Details
    </button>
  </td>

  <td className="py-2 px-3">
    {truncateText(item?.orgnization?.name)}
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
<td className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.some(user => user.id === item.id)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(prev => [...prev, { id: item.id, status: item.account_status }]);
      } else {
        setSelectedIds(prev => prev.filter(user => user.id !== item.id));
      }
    }}
  />
</td>

  <td className="py-2 px-3 text-[12px] align-middle">
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
