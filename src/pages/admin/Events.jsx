import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";

const Events = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
const [sortKey, setSortKey] = useState('');
const [sortOrder, setSortOrder] = useState('');
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.events);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://backndVoo.voo-hub.com/api/admin/event/delete/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate(!update);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success"
            );
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              `There was an error while deleting ${userName}.`,
              "error"
            );
          });
      } else {
        Swal.fire("Cancelled", `${userName} was not deleted.`, "info");
      }
    });
  };
  const handleEdit = (id) => {
    navigate("/admin/addevents", { state: { sendData: id } });
  };
  const [selectedDate, setSelectedDate] = useState("");

  const handleChangedata = (e) => {
    setSelectedDate(e.target.value); 
  };

const filteredData = data.filter((item) => {
  const query = searchQuery.toLowerCase();

  // فلترة حسب التاريخ إذا كان مختار
  const isDateMatch =
    !selectedDate || item.date === selectedDate;

  // فلترة حسب البحث
  let isSearchMatch;
  if (selectedFilter === "Filter" || selectedFilter === "") {
    isSearchMatch = Object.values(item).some((value) =>
      typeof value === "object"
        ? Object.values(value || {}).some((sub) =>
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

    isSearchMatch = value?.toString().toLowerCase().includes(query);
  }

  // شرط نهائي: لازم يطابق التاريخ + البحث
  return isDateMatch && isSearchMatch;
});


  const cheose = ["Filter", "name", "date", "start_time", "location"];
  const labelMap = {
    Filter: "Filter",
    name: "event",
    date: "date",
    start_time: "time(start)",
    location: "location",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData]; 
  
    if (!sortKey || !sortOrder) {
      return sortableData;
    }
  
    return sortableData.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
  
  
      if (sortKey === 'date') {
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
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const handleBulkDelete = () => {
  const token = localStorage.getItem("token");

  Swal.fire({
    title: `Are you sure you want to delete ${selectedIds.length} event?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      const requests = selectedIds.map((id) =>
        axios.delete(`https://backndVoo.voo-hub.com/api/admin/event/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      Promise.all(requests)
        .then(() => {
          setUpdate((prev) => !prev);
          setSelectedIds([]);
          Swal.fire("Deleted!", "Selected event have been deleted.", "success");
        })
        .catch(() => {
          Swal.fire("Error", "Some deletions failed.", "error");
        });
    }
  });
};
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="relative items-center">
          <input
            placeholder="Search"
            className="w-[100px] md:min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>
        <div className="flex items-center gap-4 my-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangedata}
            className="px-3 py-2border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
<select
  value={`${sortKey}:${sortOrder}`}
  onChange={(e) => {
    const [key, order] = e.target.value.split(':');
    setSortKey(key || '');
    setSortOrder(order || '');
  }}
  className="text-[14px] h-9 border border-one rounded-[8px] px-2"
>
  <option value="">Sort By</option>

  <option value="date:asc"> Date ↑</option>
  <option value="date:desc"> Date ↓</option>
</select>
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
              className="flex justify-center w-15 md:w-20 text-[10px] md:text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
            
          </button>
          
          <button
            onClick={() => navigate("/admin/addevents")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>
            {selectedIds.length > 0 && (
  <div className="flex gap-2 mt-4">
  
    <button
      className="bg-one/80 text-white px-4 py-2 rounded"
      onClick={() => handleBulkDelete()}
    >
      Delete Selected

    </button>
  </div>
)}
      <div className="mt-10 block text-left">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead className="w-full">
              <tr className="bg-four ">
                <th className="py-4 px-3">S/N</th>
                <th className="py-4 px-3">Tasks</th>
                <th className="py-4 px-3">Date</th>
                <th className="py-4 px-3">Start Time</th>
                <th className="py-4 px-3">End Time</th>
                <th className="py-4 px-3">Details</th>
                <th className="py-4 px-3">Operation</th>
                <th className="py-4 px-3">location</th>
                 <th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {<th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {
        setSelectedIds([]);
      }
    }}
  />
</th>

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
                <tr
                  key={item.id}
                  className="border-y hover:border-3 relative hover:bg-four"
                >
                  <td className="py-4 px-3 font-bold">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-3">{truncateText(item?.name)}</td>
                  <td className="py-4 px-3">{truncateText(item?.date)}</td>
                  <td className="py-4 px-3">
                    {item?.start_time ?? "N/A"} 
                  </td>
                  <td className="py-4 px-3">
                    {item?.end_time ?? "N/A"}
                  </td>
                  <td className="py-4 px-3 ">
                    <button
                      className="underline "
                      onClick={() =>
                        navigate("/admin/eventDetalis", {
                          state: { sendData: item.id },
                        })
                      }
                    >
                      Details
                    </button>
                  </td>
                  <td className="py-4 px-3">
                    <button
                      className="underline "
                      onClick={() =>
                        navigate("/admin/operation", {
                          state: { sendData: item.id },
                        })
                      }
                    >
                      operation
                    </button>
                  </td>
                  <td className="py-4 px-3">{truncateText(item?.location)}</td>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, item.id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </td>
                  
                  <td className="py-4 px-3 text-[12px] align-middle">
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
      <div className="lg:hidden mt-6 mx-auto space-y-4 w-75">
        {paginatedData.map((item, index) => (
          <div
            key={item.id}
            className="border rounded-md relative p-4 shadow-sm"
          >
            <p className="text-sm text-right absolute top-1 right-1">
              {" "}
              {(currentPage - 1) * rowsPerPage + index + 1}
            </p>
            <h3 className="text-lg font-semibold">{item?.name ?? "N/A"}</h3>
            <p className="text-sm">📅 {item?.date ?? "N/A"}</p>
            <p className="text-sm">
              ⏰ Start: {item?.start_time ?? "N/A"}, End:{" "}
              {item?.end_time ?? "N/A"}
            </p>
            <p className="text-sm">📍 {item?.location ?? "N/A"}</p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() =>
                  navigate("/admin/eventDetalis", {
                    state: { sendData: item.id },
                  })
                }
                className="text-gray-950 underline text-sm"
              >
                Details
              </button>
              <button
                onClick={() =>
                  navigate("/admin/operation", { state: { sendData: item.id } })
                }
                className="text-gray-950 underline text-sm"
              >
                Operation
              </button>
              <div className="flex gap-2">
                <CiEdit
                  className="text-six cursor-pointer"
                  onClick={() => handleEdit(item.id)}
                />
                <RiDeleteBin6Line
                  className="text-five cursor-pointer"
                  onClick={() => handleDelete(item.id, item.name)}
                />
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
  );
};

export default Events;
