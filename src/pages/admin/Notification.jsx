import React, { useEffect, useState } from "react";
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

const Notification = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/notification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const notifications = response.data.notifications;
        setData(notifications);
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
            `https://backndVoo.voo-hub.com/api/admin/notification/delete/${userId}`,
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
    navigate("/admin/addotification", { state: { sendData: id } });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
        typeof value === "object"
          ? Object.values(value).some((sub) =>
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
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const cheose = ["Filter", "notification"];
  const labelMap = {
    Filter: "Filter",
    notification: "notification",
  };
  const [selectedViewers, setSelectedViewers] = useState([]);
const [showModal, setShowModal] = useState(false);
  const handleView = (notificationId) => {
  const token = localStorage.getItem("token");

  axios
    .get(`https://backndVoo.voo-hub.com/api/admin/notification/item/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setSelectedViewers(res.data?.notification?.users || []);
      setShowModal(true);
    })
    .catch(() => {
      toast.error("Failed to fetch viewers");
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
              className="flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
          <button
            onClick={() => navigate("/admin/addotification")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>

      <div className="mt-10 block text-left">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead className="w-full">
              <tr className="bg-four ">
                <th className="py-4 px-3">S/N</th>
                <th className="py-4 px-3">Name</th>
                <th className="py-4 px-3">view</th>
                <th className="py-4 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(paginatedData) &&
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-y border-x hover:border-3 relative hover:bg-four"
                  >
                    <td className="py-2 px-3 font-bold">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-3">{truncateText(item?.notification)}</td>
<td className="py-4 px-3">
  <button
    onClick={() => handleView(item.id)}
    className="text-white px-2 py-1 rounded-2xl bg-one"
  >
    View
  </button>
</td>
                    <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px] flex justify-start items-center">
                      <CiEdit
                        className="w-[24px] h-[24px] text-six cursor-pointer"
                        onClick={() => handleEdit(item.id)}
                      />
                      <RiDeleteBin6Line
                        className="w-[24px] h-[24px] ml-2 text-five cursor-pointer"
                        onClick={() => handleDelete(item.id, item.notification)}
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
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
      <h2 className="text-xl text-one font-bold mb-4 text-center">
        Users who viewed this notification
      </h2>
      <ul className="max-h-[300px] overflow-y-auto divide-y">
        {selectedViewers.length > 0 ? (
          selectedViewers.map((user, i) => (
            <li key={user.id} className="py-2 text-sm">
              {i + 1}. {user.name} – {user.email}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No viewers found</p>
        )}
      </ul>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="bg-one hover:bg-opacity-90 text-white py-1 px-6 rounded-full transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      <ToastContainer />
    </div>
  );
};

export default Notification;
