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
import { useTranslation } from "react-i18next";
import Loader from "../../ui/Loader";

const ProjectOr = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/project", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.projects);
      })
      .catch(() => {
        toast.error("Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [update]);

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
            `https://backndVoo.voo-hub.com/api/ornization/project/delete/${userId}`,
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
    navigate("/organizeation/addprojector", { state: { sendData: id } });
  };
  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
        typeof value === "object"
          ? Object.values(value || {}).some((sub) =>
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
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const cheose = ["Filter", "name", "description"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("name"),
    description: t("Description"),
  };
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const columns = [
    {
      header: t("S/N"),
      render: (_, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("Name"),
      render: (row) => row.name,
    },
    {
      header: t("Description"),
      render: (row) => row.description,
    },

    {
      header: t("Action"),
      render: (row) => (
        <div className="flex items-center">
          <CiEdit
            className="w-[22px] h-[22px] text-six cursor-pointer"
            onClick={() => handleEdit(row.id)}
          />
          <RiDeleteBin6Line
            className="w-[22px] h-[22px] ml-2 text-red-500 cursor-pointer"
            onClick={() => handleDelete(row.id, row.name)}
          />
        </div>
      ),
    },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <input
            placeholder={t("Search")}
            className="w-full md:min-w-[250px] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:top-3" />
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter */}
          <button className="flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10">
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
              className="w-24 md:w-20 text-[14px] md:text-[16px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1 outline-none"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>

          {/* Add Button */}
          <button
            onClick={() => navigate("/organizeation/addprojector")}
            className="flex justify-center items-center bg-white border border-one py-1 px-3 rounded-[8px] gap-1 h-10 w-full sm:w-auto"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[14px] md:text-[20px] font-medium text-one">
              {t("add")}
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 w-full overflow-x-auto">
        <ReusableTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProjectOr;
