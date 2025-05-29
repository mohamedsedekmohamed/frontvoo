import React, { useEffect, useState } from "react";
import axios from "axios";
import filter from "../../../assets/filter.svg";
import { CiSearch } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiCircleMore } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";
import IconSuggest  from "../../../Icons/IconSuggest";
import { IoCallSharp } from "react-icons/io5";

const Suggestions = ({id}) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    axios
      .get(`https://backndVoo.voo-hub.com/api/admin/getEventSuggest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);

      })
      .catch(() => {
        toast.error('faild network');
      });
  }, [update]);

  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return (
        Object.values(item.user || {}).some((value) =>
          value?.toString().toLowerCase().includes(query)
        ) ||
        Object.values(item).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(query)
        )
      );
    } else if (selectedFilter === "user.name") {
      return item.user?.name?.toLowerCase().includes(query);
    } else {
      const value = item[selectedFilter];
      return value?.toString().toLowerCase().includes(query);
    }
  });

  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const cheose = ["Filter", "suggest_title", "suggest_description", "user.name"];
  const labelMap = {
    Filter: "Filter",
    suggest_title: "Title",
    suggest_description: "Description",
    "user.name": "User Name",
  };
  const fetchEventDetails = (eventId) => {
    const event = data.find((item) => item.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowModal(true);
    }
  };
  

const markEventAsRead = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.put(`https://backndVoo.voo-hub.com/api/admin/readEventSuggest/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setUpdate(prev => !prev);
    toast.success("Event marked as read successfully");
    setShowModal(false)

  } catch {
    toast.error("Failed to mark event as read");
    setShowModal(false)

  }
};

  return (
    <div>
      <div className="flex  flex-col  gap-1 lg:flex-row justify-between items-center">
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

      <div className="mt-10 hidden md:block">
      <table className="w-full border-y border-x border-black">
          <thead>
            <tr className="bg-four w-[1012px] h-[56px]">
              <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">ID</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Title</th>
              <th className="w-[220px] h-[56px] text-[16px] border-b text-left">Description</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">User Name</th>
              <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={item.id} className="border-y hover:border-3 relative hover:bg-four">
                <td className="w-[30px] h-[56px] font-bold text-[12px] px-3">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="w-[160px] h-[56px] text-[14px]">{item.suggest_title ?? "N/A"}</td>
                <td className="w-[220px] h-[56px] text-[12px]">{item.suggest_description ?? "N/A"}</td>
                <td className="w-[190px] h-[56px]  text-[12px]">
                  {item.user?.name ?? "N/A"}
                </td>
                <td className="w-[190px] h-[56px] text-white text-[16px]">
                  <button
                    onClick={() =>   fetchEventDetails(item.id)}
                    className="text-white w-20 bg-one px-2 py-1 text-[16px] rounded-[8px]"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 md:hidden flex flex-col gap-4">
    {paginatedData.map((item, index) => (
      <div key={item.id} className="border border-gray-300 p-4 rounded shadow-sm bg-white">
        <p><strong>ID:</strong> {(currentPage - 1) * rowsPerPage + index + 1}</p>
        <p><strong>title:</strong> {item.shakwa_title ?? "N/A"}</p>
        <p><strong>description:</strong> {item.shakwa_description ?? "N/A"}</p>
        <p><strong> User name :
        :</strong> {item.user?.name ?? "N/A"}</p>
        <div className="mt-2  flex gap-2 justify-start items-center">
          <label className="block text-sm mb-1">View:</label>
          <button
                                      onClick={() =>   fetchEventDetails(item.id)}

                    className="text-white w-20 bg-one px-2 py-1 text-[16px] rounded-[8px]"
                  >
                    View
                  </button>
        </div>
      </div>
    ))}
  </div>







'
      <div className="flex justify-center mt-4">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="secondary"
          shape="rounded"
        />
      </div>

      {showModal && selectedEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
    <div className="bg-white p-6 rounded-md w-full shadow-xl text-black overflow-y-auto max-h-[90vh]">
      <div className="font-bold mb-4 flex items-center">
        <CiCircleMore className="text-one text-[50px] py-2" />
        <span className="text-one font-medium">Suggestion</span>
      </div>

      <div>
        <span className="text-one my-3">Suggestion Details</span>
        <p>{selectedEvent.suggest_description ?? "N/A"}</p>
      </div>

      <div className="flex flex-col mt-2 gap-1">
        <div className="flex gap-5 my-2 items-center">
          <IoPerson className="text-[14px] text-ten" /> Name:
          <span className="text-ten font-medium text-[12px]">
            {selectedEvent?.user?.name ?? "N/A"}
          </span>
        </div>

        <div className="flex gap-5 my-1 items-center">
          <IconSuggest /> Subject:
          <span className="text-ten font-medium text-[12px]">
            {selectedEvent?.event?.name ?? "N/A"}
          </span>
        </div>

        <div className="flex gap-5 my-1 items-center">
          <IoCallSharp className="text-[14px] text-ten" /> Phone Number:
          <span className="text-ten font-medium text-[12px]">
            {selectedEvent?.user?.phone ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-6 text-right flex gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="bg-one text-white px-4 py-2 rounded"
        >
          Close
        </button>
        <button
          onClick={() => markEventAsRead(selectedEvent?.id)}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Read
        </button>
      </div>
    </div>
  </div>
)}

      <ToastContainer />

    </div>
  );
};

export default Suggestions;
