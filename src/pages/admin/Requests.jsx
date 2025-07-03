import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";

const Requests = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState("task"); // task or event
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.requests);
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
            `https://backndVoo.voo-hub.com/api/admin/request/delete/${userId}`,
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

  const accept = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to accept ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/admin/request/accept/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Accepted!", `${userName} has been accepted.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to accept ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not accepted.`, "info");
      }
    });
  };

  const reject = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to reject ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/admin/request/reject/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Rejected!", `${userName} has been rejected.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to reject ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not rejected.`, "info");
      }
    });
  };

  const cheose = [
    "Filter",
    "user.name",
    "user.email",
    "task.name",
    "event.name",
    "orgnization.name",
  ];
  const labelMap = {
    Filter: "Filter",
    "user.name": "user",
    "user.email": "email",
    "task.name": "task",
    "event.name": "event",
    "orgnization.name": "orgnization",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredByType = filteredData.filter(
    (item) => item.request_type === active
  );
  const pageCount = Math.ceil(filteredByType.length / rowsPerPage);
  const paginatedData = filteredByType.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
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
        <div className="flex justify-center items-center gap-2 ">
          <button
            onClick={() => {
              setActive("task");
              setCurrentPage(1); // reset to first page
            }}
            className={`w-40 h-10 ${
              active === "task"
                ? "bg-one text-white"
                : "bg-white text-black border border-one"
            } rounded`}
          >
            Task
          </button>

          <button
            onClick={() => {
              setActive("event");
              setCurrentPage(1); // reset to first page
            }}
            className={`w-40 h-10 ${
              active === "event"
                ? "bg-one text-white"
                : "bg-white text-black border border-one"
            } rounded`}
          >
            Event
          </button>
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
        </div>
      </div>
      <div className="mt-10 block text-left">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead className="w-full">
              <tr className="bg-four w-[1012px] h-[56px]">
                <th className="py-4 px-3">S/N</th>
                <th className="py-4 px-3 ">Type</th>
                <th className="py-4 px-3 ">User</th>
                <th className="py-4 px-3 ">Task</th>
                <th className="py-4 px-3 ">Event</th>
                <th className="py-4 px-3 ">Orgnization</th>
                <th className="py-4 px-3 ">Action</th>
                <th className="py-4 px-3">Details</th>
                <th className="py-4 px-3">
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

                  <td className="py-4 px-3">
                    {truncateText(item?.request_type)}
                  </td>
                  <td className="py-2 px-3 text-[12px]">
                    <div className="flex flex-col justify-center">
                      <span className="">
                        {truncateText(item?.user?.name)}
                      </span>
                      <span className=" ">
                        {truncateText(item?.user?.email)}
                      </span>
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    {truncateText(item?.task?.name)}
                  </td>

                  <td className="py-2 px-3">
                    {truncateText(item?.event?.name)}
                  </td>

                  <td className="py-2 px-3">
                    {truncateText(item?.orgnization?.name)}
                  </td>

                  <td className="py-2 px-3">
                    <select
                      className="text-sm border px-2 py-1  bg-one text-white"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "accept") {
                          accept(item.id, item?.request_type);
                        } else if (value === "reject") {
                          reject(item.id, item?.request_type);
                        }
                      }}
                      defaultValue="select"
                    >
                      <option value="select">select</option>
                      <option value="accept">Accept</option>
                      <option value="reject">Reject</option>
                    </select>
                  </td>

                  <td className="py-2 px-3 text-[12px] align-middle">
                    <button
                      className="underline"
                      onClick={() =>
                        navigate("/admin/requestsdetails", {
                          state: { sendData: item.id },
                        })
                      }
                    >
                      Details
                    </button>
                  </td>
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

                  <td className=" ">
                    <div className="flex items-center">
                      <RiDeleteBin6Line
                        className="w-[24px] h-[24px] text-five cursor-pointer hover:text-red-600 transition"
                        onClick={() =>
                          handleDelete(item.id, item?.request_type)
                        }
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

export default Requests;
