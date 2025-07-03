import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";

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
  setData(response.data.policy);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);

  const handleEdit = () => {
    navigate("/admin/addpolicies", { state: { sendData: data } });
  };
    const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  return (
    <div>
        

      <div className="mt-10 block text-left overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead>
              <tr className="bg-four">
                <th className="py-4 px-3">S/N</th>
                <th className="py-4 px-3">Name</th>
                <th className="py-4 px-3">Policies</th>
                <th className="py-4 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-y border-x hover:border-3 relative hover:bg-four h-[56px]">
                <td className="px-3">1</td>
                <td className="px-3">{data.name||"A/N"}</td>
                <td className="px-3">{truncateText(data.value)}</td>
                <td className="px-3 flex  mt-4 gap-2">
                  <CiEdit
                    className="w-[24px] h-[24px] text-six cursor-pointer"
                    onClick={() => handleEdit()}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Policies;
