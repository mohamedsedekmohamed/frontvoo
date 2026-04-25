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
import ReusableTable from "../../ui/ReusableTable";
import useCrud from "../../Hooks/useCrud";
import Loader from "../../ui/Loader";
import ErrorPage from "../../ui/ErrorPage";

const Notification = () => {
  const [update, setUpdate] = useState(false);
  const {data, read, loading, error } = useCrud("/admin/notification","notifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
   read();
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
            },
          )
          .then(() => {
            setUpdate(!update);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success",
            );
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              `There was an error while deleting ${userName}.`,
              "error",
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
              sub?.toString().toLowerCase().includes(query),
            )
          : value?.toString().toLowerCase().includes(query),
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
  //const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const cheose = ["Filter", "notification", "title"];
  const labelMap = {
    Filter: "Filter",
    notification: "notification",
    title: "title",
  };
  const [selectedViewers, setSelectedViewers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleView = (notificationId) => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `https://backndVoo.voo-hub.com/api/admin/notification/item/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setSelectedViewers(res.data?.notification?.users || []);
        setShowModal(true);
      })
      .catch(() => {
        toast.error("Failed to fetch viewers");
      });
  };
  const columns = [
    {
      header: "S/N",
      render: (_, index) => (currentPage - 1) * rowsPerPage + index + 1,
    },
    { header: "Title", accessor: "title" },
    { header: "Name", accessor: "notification" },
    {
      header: "View",
      render: (item) => (
        <button
          onClick={() => handleView(item.id)}
          className="text-white px-2 py-1 rounded-2xl bg-one"
        >
          View
        </button>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center">
          <CiEdit
            className="w-[24px] h-[24px] text-six cursor-pointer hover:text-blue-500 transition"
            onClick={() => handleEdit(row.id)}
          />
          <RiDeleteBin6Line
            className="w-[24px] h-[24px] ml-2 text-five cursor-pointer hover:text-red-600 transition"
            onClick={() => handleDelete(row.id, row.name)}
          />
        </div>
      ),
    },
  ];
if (loading) {
  return <Loader />;
}
if (error) {return <ErrorPage onRetry={read} />;}
 return (
  <div className="w-full">

    {/* Top Controls */}
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

      {/* Search */}
      <div className="relative w-full md:w-auto">
        <input
          placeholder="Search"
          className="w-full md:min-w-[250px] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
      </div>

      {/* Filter + Add */}
      <div className="flex gap-2 flex-wrap w-full md:w-auto">

        {/* Filter */}
        <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10 w-full md:w-auto">
          <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

          <select
            value={selectedFilter}
            onChange={handleChange}
            className="w-full md:w-24 text-[14px] md:text-[16px] bg-transparent text-white outline-none cursor-pointer"
            style={{ appearance: "none" }}
          >
            {cheose.map((option, index) => (
              <option key={index} value={option} className="text-black bg-white">
                {labelMap[option] || option}
              </option>
            ))}
          </select>
        </div>

        {/* Add */}
        <button
          onClick={() => navigate("/admin/addotification")}
          className="flex justify-center items-center h-10 bg-white border-one border py-1 px-3 rounded-[8px] gap-1 hover:bg-gray-50 transition w-full md:w-auto"
        >
          <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
          <span className="text-[16px] font-medium text-one">Add</span>
        </button>

      </div>
    </div>

    {/* Table */}
    <div className="w-full overflow-x-auto">
      <ReusableTable
        columns={columns}
        data={paginatedData}
        currentPage={1}
        pageCount={1}
        onPageChange={() => {}}
        forceEnglishTitle={true}
      />
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10 p-4">
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
              className="bg-one hover:bg-opacity-90 text-white py-1 px-6 rounded-full transition"
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
