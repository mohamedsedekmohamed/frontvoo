import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCrown } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Information = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch admin profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .get("https://backndVoo.voo-hub.com/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data.user))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-one animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-b-transparent border-three animate-spin-reverse"></div>
          <div className="absolute inset-6 rounded-full bg-one opacity-40"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* PROFILE CARD */}
      <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <img
          src={data?.avatar_image_link}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-one"
        />

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-one">
            {data.name || "No Name"}
          </h2>

          <p className="text-gray-500">{data.email || "No Email"}</p>

          <span className="inline-flex items-center gap-2 mt-2 text-sm bg-purple-100 text-one px-3 py-1 rounded-full">
            <FaCrown />
            Super Admin
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100"
          >
            <CiLogout className="text-2xl text-red-500" />
          </button>

          <button
            onClick={() => navigate("/admin/AddInformation")}
            className="p-2 rounded-full hover:bg-blue-100"
          >
            <FaUserEdit className="text-2xl text-blue-500" />
          </button>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-white shadow-sm rounded-2xl mt-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
            <path
              d="M13 0C5.8 0 0 5.8 0 13C0 20.2 5.8 26 13 26C20.2 26 26 20.2 26 13C26 5.8 20.2 0 13 0ZM12.7 6.5C13.4 6.5 13.9 7.06 13.9 7.75C13.9 8.43 13.4 9 12.7 9C12 9 11.4 8.43 11.4 7.75C11.4 7.06 12 6.5 12.7 6.5ZM15 19H11V18.5H12V11H11V10.5H14V18.5H15V19Z"
              fill="#730FC9"
            />
          </svg>

          <h3 className="text-xl font-semibold text-one">
            Personal Information
          </h3>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg font-medium text-one">
              {data.phone || "No phone"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-lg font-medium text-one">
              {data.gender || "No gender"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
