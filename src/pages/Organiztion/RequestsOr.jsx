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
import { useTranslation } from 'react-i18next';
import Pagination from '@mui/material/Pagination';

const RequestsOr = () => {
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get("https://backndVoo.voo-hub.com/api/orgnization/request", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                    setData(response.data.requests);
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

    const cheose = ["Filter", "request_type", "user.email", "task.name", "event.name", "orgnization.name"];
    const labelMap = {
        Filter: "Filter",
        "request_type": "type",
        "user.email": "email",
        "task.name": "task",
        "event.name": "event",
        "orgnization.name": "orgnization",
    };
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const pageCount = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleAccept = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/accept/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Request accepted successfully");
                setUpdate(prev => !prev); // Force re-render to update the table
            })
            .catch(() => {
                toast.error("Error accepting request");
            });
    };

    const handleReject = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/reject/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Request rejected successfully");
                setUpdate(prev => !prev); // Force re-render to update the table
            })
            .catch(() => {
                toast.error("Error rejecting request");
            });
    };

    const handleAttend = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/attend/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Attendance updated successfully");
                setUpdate(prev => !prev); // Force re-render to update the table
            })
            .catch(() => {
                toast.error("Error updating attendance");
            });
    };

    const handleLost = (id) => {
        const token = localStorage.getItem('token');
        axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/lost/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Request marked as lost successfully");
                setUpdate(prev => !prev); // Force re-render to update the table
            })
            .catch(() => {
                toast.error("Error marking request as lost");
            });
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
                            className='flex justify-center w-20 text-[12px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1'
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

            <div className="mt-10  block">
                <table className="w-full border-y border-x border-black">
                    <thead className="w-full">
                        <tr className='bg-four w-[1012px] h-[56px]'>
                            <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">ID</th>
                            <th className="w-[75px] h-[56px] text-[16px] border-b text-left">type</th>
                            <th className="w-[200px] h-[56px] text-[16px] border-b text-left">user</th>
                            <th className="w-[75px] h-[56px] text-[16px] border-b text-left">task</th>
                            <th className="w-[158px] h-[56px] text-[16px] border-b text-left">event</th>
                            <th className="w-[158px] h-[56px] text-[16px] border-b text-left">orgnization</th>
                            <th className="w-[158px] h-[56px] text-[16px] border-b text-left">Status</th>
                            <th className="w-[400px] h-[56px] text-[16px] border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={item.id} className='border-y hover:border-3 relative hover:bg-four'>
                                <td className="w-[30px] h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                </td>
                                <td className="w-[75px] h-[56px] lg:text-[12px] xl:text-[12px]">{item?.request_type ?? "N/A"}</td>
                                <td className="flex flex-col w-[200px] absolute top-1 h-[56px] p-1 gap-1">
                                    <span className='text-[12px]'>
                                        {item?.user?.name ?? "N/A"}
                                    </span>
                                    <span className='text-[10px]'>
                                        {item?.user?.email ?? "N/A"}
                                    </span>
                                </td>
                                <td className="w-[75px] h-[56px] lg:text-[12px] xl:text-[14px]">{item?.task?.name ?? "N/A"}</td>
                                <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px]">{item?.event?.name ?? "N/A"}</td>
                                <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px]">{item?.orgnization?.name ?? "N/A"}</td>
                                <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px] text-three "> <span className='bg-eight rounded-circle px-2 py-1'>{item?.status ?? "N/A"}</span></td>
                               
                                <td className="w-[400px] h-[56px] flex items-center justify-around px-2">
                                    <button
                                        className='text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleAccept(item.id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className='text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleReject(item.id)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className='text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleAttend(item.id)}
                                    >
                                        Attend
                                    </button>
                                    <button
                                        className='text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleLost(item.id)}
                                    >
                                        Lost
                                    </button>
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

export default RequestsOr