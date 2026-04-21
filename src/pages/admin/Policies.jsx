import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
const Policies = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndvoo.voo-hub.com/api/admin/policy", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);

  const handleEdit = () => {
    navigate("/admin/addpolicies", { state: { sendData: data } });
  };

  const columns = [
    {
      header: "S/N",
      render: (row, i) => i + 1,
    },
    {
      header: "Title",
      render: (row) => row?.policy,
    },
    {
      header: "Description",
      render: (row) => row?.description,
    },
 
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <CiEdit
            className="w-[24px] h-[24px] text-six cursor-pointer"
            onClick={() => handleEdit(row.id)}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="mt-6">
        <ReusableTable
          columns={columns}
          data={Array.isArray(data) ? data : [data]}
          currentPage={1}
          pageCount={1}
          onPageChange={() => {}}
          forceEnglishTitle={true}
        />
      </div>
     
    </div>
  );
};

export default Policies;
