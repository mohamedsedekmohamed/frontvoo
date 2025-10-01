import React, { useEffect, useState } from 'react';
import { CiSearch, CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import filter from '../../assets/filter.svg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from '@mui/material/Pagination';

 const Pendingusers = () => {
     const [data, setData] = useState([]);
      const [update, setUpdate] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedFilter, setSelectedFilter] = useState('');
        const navigate = useNavigate();
        const [selectedIds, setSelectedIds] = useState([]);
      
        useEffect(() => {
          setCurrentPage(1);
        }, [searchQuery]);
      
      useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get("https://backndVoo.voo-hub.com/api/admin/bnyadm", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            setData(response.data.data || []);
          })
          .catch(() => {
            toast.error("Error fetching data");
          });
      }, [update]);
    
      const handleChange = (e) => {
        setSelectedFilter(e.target.value);
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
     
        const accept = (id, userName) => {
            const token = localStorage.getItem('token');
        
            Swal.fire({
              title: `Are you sure you want to accept ${userName}?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then((result) => {
              if (result.isConfirmed) {
                axios.put(`https://backndVoo.voo-hub.com/api/admin/bnyadm/accept/${id}`, {}, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(() => {
                    setUpdate(prev => !prev);
                    Swal.fire('Accepted!', `${userName} has been accepted.`, 'success');
                  })
                  .catch(() => {
                    Swal.fire('Error!', `Failed to accept ${userName}.`, 'error');
                  });
              } else {
                Swal.fire('Cancelled', `The request was not accepted.`, 'info');
              }
            });
          };
        
          const reject = (id, userName) => {
            const token = localStorage.getItem('token');
        
            Swal.fire({
              title: `Are you sure you want to reject ${userName}?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            }).then((result) => {
              if (result.isConfirmed) {
                axios.put(`https://backndVoo.voo-hub.com/api/admin/bnyadm/reject/${id}`, {}, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(() => {
                    setUpdate(prev => !prev);
                    Swal.fire('Rejected!', `${userName} has been rejected.`, 'success');
                  })
                  .catch(() => {
                    Swal.fire('Error!', `Failed to reject ${userName}.`, 'error');
                  });
              } else {
                Swal.fire('Cancelled', `The request was not rejected.`, 'info');
              }
            });
          };
        
        
        const [currentPage, setCurrentPage] = useState(1);
          const rowsPerPage = 10;
          const pageCount = Math.ceil(filteredData.length / rowsPerPage);
          const paginatedData = filteredData.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          );
       
             
        const cheose = ["Filter", "user.name", "orgnization.name", "user.email", "status"];
        const labelMap = {
          Filter: "Filter",
          "user.name": "User",
          "orgnization.name": "orgnization",
          "user.email": "email",
          "status": "status",
        };
          const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

 
 const handleBulkAction = (action) => {
  const token = localStorage.getItem("token");
  const label = action === "accept" ? "Accepted" : "Rejected";

  Swal.fire({
    title: `Are you sure you want to ${action} ${selectedIds.length} Pending?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(
        `https://backndVoo.voo-hub.com/api/admin/bnyadm/${action}Group`,
        { ids: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(() => {
          setUpdate((prev) => !prev);
          setSelectedIds([]);
          Swal.fire(
            `${label}!`,
            `All selected Pending have been ${label.toLowerCase()}.`,
            "success"
          );
        })
        .catch(() => {
          Swal.fire("Error", "One or more Pending failed.", "error");
        });
    }
  });
};

  return (
    <div><div className='flex justify-between items-center'>
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
            </div>
          </div>
           {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("accept")}
          >
            Accept Selected
          </button>
          <button
            className="bg-one/70 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("reject")}
          >
            Reject Selected
          </button>
        </div>
      )}
            <div className="mt-10 block text-left">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead className="w-full">
              <tr className="bg-four ">
                       <th className="py-4 px-3">S/N</th>
                       <th className="py-4 px-3">User</th>
                       <th className="py-4 px-3">Orgnization</th>
                       <th className="py-4 px-3">Accept</th>
                       <th className="py-4 px-3">Reject</th>
                       <th className="py-4 px-3">Status</th>
                       <th className="py-4 px-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(
                              paginatedData.map((item) => item.id)
                            );
                          } else {
                            <th className="py-4 px-3">
                              <input
                                type="checkbox"
                                checked={
                                  selectedIds.length === paginatedData.length &&
                                  paginatedData.length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedIds(
                                      paginatedData.map((item) => item.id)
                                    );
                                  } else {
                                    setSelectedIds([]);
                                  }
                                }}
                              />
                            </th>;

                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                       <th className="py-4 px-3">Details</th>
         
                     </tr>
                   </thead>
                   <tbody>
                     {paginatedData.map((item, index) => (
                      <tr
                  key={item.id}
                  className="border-y hover:border-3 relative hover:bg-four"
                >
                  <td className="py-4 px-3 font-bold">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                         <td className="flex flex-col w-[200px] absolute top-1 h-[56px] p-1 gap-1">
                           <span className='text-[12px]'>
                             {item?.user?.name ?? "N/A"}
                           </span>
                           <span className='text-[10px]'>
                             {truncateText(item?.user?.email)}
                           </span>
                         </td>
                         <td className="py-4 px-3">{truncateText(item?.orgnization?.name)}</td>
                         <td className="h-[56px] lg:text-[12px] xl:text-[14px]">
                           <button className='text-white bg-three px-2 py-1 rounded-full' onClick={() => accept(item.id, item?.user?.name)}>Accept</button>
                         </td>
                         <td className="h-[56px] lg:text-[12px] xl:text-[14px]">
                           <button className='text-white bg-three px-2 py-1 rounded-full' onClick={() => reject(item.id, item?.user?.name)}>Reject</button>
                         </td>
                         
                         <td className="h-[56px] lg:text-[12px] xl:text-[14px] text-three "> <span className='bg-eight rounded-circle px-2 py-1'>{item?.status ?? "N/A"}</span></td>
                       <th className="py-4 px-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(
                              paginatedData.map((item) => item.id)
                            );
                          } else {
                            <th className="py-4 px-3">
                              <input
                                type="checkbox"
                                checked={
                                  selectedIds.length === paginatedData.length &&
                                  paginatedData.length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedIds(
                                      paginatedData.map((item) => item.id)
                                    );
                                  } else {
                                    setSelectedIds([]);
                                  }
                                }}
                              />
                            </th>;

                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                         <td className="h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
                           <button className='underline ' onClick={() => navigate('/admin/pendingusersDetaklis', { state: { sendData: item.id } })}>
                           details                           </button>
         
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
export default Pendingusers