import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../ui/Loader";
import ErrorPage from "../../ui/ErrorPage";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
import useCrud from "../../Hooks/useCrud";
const Policies = () => {
  const {data, read,loading,error } = useCrud("/admin/policy","data");
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    read();
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
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorPage onRetry={read} />;
  }
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
