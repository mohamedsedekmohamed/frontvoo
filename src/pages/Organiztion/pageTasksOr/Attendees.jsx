import React, { useEffect, useState } from "react";
import axios from "axios";
import filter from "../../../assets/filter.svg";
import { CiSearch } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Attendees = ({ id }) => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    
    axios
        .get(`https://backndVoo.voo-hub.com/api/orgnization/getTaskVolunteers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const volunteers = response.data?.data?.task_volunteers || [];
        setData(volunteers);
      })
      .catch(() => {
        toast.error('faild network');});
  }, [id, update]); // أضف id كاعتمادية

  

  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const user = item.user || {};

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(query)
      );
    } else {
      const value = user[selectedFilter];
      return value?.toString().toLowerCase().includes(query);
    }
  });

  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const cheose = ["Filter", "name", "email"];
  const labelMap = {
    Filter: "Filter",
    name: "Name",
    email: "Email",
  };
  const handleStatusChange = (ids, newStatus) => {
    console.log(ids, newStatus)
    const token = localStorage.getItem("token");
    axios
      .put(`https://backndVoo.voo-hub.com/api/orgnization/changeTaskVolunteerStatus/${ids}`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Status updated successfully");
        setData(prevData =>
          prevData.map(volunteer =>
            volunteer.user_id === ids
              ? { ...volunteer, status: newStatus }
              : volunteer
          )
        );
      })
      
      .catch((err) => {
        console.error("Error updating status", err);
      });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="relative items-center">
          <input
            placeholder="Search"
            className="min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>
        <div className="flex gap-2">
          <button className="flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1">
            <img src={filter} className="text-white w-4 h-4 md:w-6 md:h-6" />
            <select
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                paddingRight: "20px",
                backgroundImage: "none",
              }}
              value={selectedFilter}
              onChange={handleChange}
              className="flex justify-center w-20 text-[12px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
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

      <div className="mt-10 block">
        <table className="w-full border-y border-x border-black">
          <thead>
            <tr className="bg-four w-[1012px] h-[56px]">
              <th className="w-[30px] h-[56px]  text-[16px] border-b text-left pl-3">
                ID
              </th>
              <th className="w-[158px] h-[56px]  text-[16px] border-b text-left">
                Name
              </th>
              <th className="w-[158px]  h-[56px] text-[16px] border-b text-left">
                Email
              </th>
              <th className="w-[158px]  h-[56px] text-[16px] border-b text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className="border-y hover:border-3 relative hover:bg-four"
              >
                <td className="w-[30px]  h-[56px]  font-bold text-[12px] px-3">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="w-[160px]  h-[56px]  text-[14px]">
                  {item.user?.name ?? "N/A"}
                </td>
                <td className="w-[160px] h-[56px]  text-[14px]">
                  {item.user?.email ?? "N/A"}
                </td>
                <td className="p-2 h-[56px] text-[12px] md:text-[14px]  ">
                    <select
                      value={item.status?? "pending"}
                      onChange={(e) => handleStatusChange(item.user_id, e.target.value)}
                      className="border p-1 rounded bg-one text-white text-[12px] md:text-[14px]"
                      style={{minWidth: '100px'}}
                    >
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="attend">Attend</option>
                      <option value="lost">Lost</option>
                    </select>
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
            <ToastContainer/>
      
    </div>
  );
};

export default Attendees;
