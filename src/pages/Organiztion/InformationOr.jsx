import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCrown } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../translation/i18n";

const InformationOr = ({ setorganiztionLayout, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "events", label: t("Events") },
    { id: "tasks", label: t("Tasks") },
  ];

  const isArabic = i18n.language === "ar";

  // Language setup
  useEffect(() => {
    const storedLang = localStorage.getItem("language");

    if (storedLang) {
      i18n.changeLanguage(storedLang);
    } else {
      const userLang = navigator.language.startsWith("ar") ? "ar" : "en";
      i18n.changeLanguage(userLang);
      localStorage.setItem("language", userLang);
    }
  }, [i18n]);

  // Fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.Orgnization))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setorganiztionLayout(false);
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
    <div
      className="bg-gray-50 min-h-screen p-4 md:p-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* PROFILE CARD */}
      <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={data?.avatar_image_link}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-one"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-one">
            {data.name || "No Name"}
          </h2>

          <p className="text-gray-500">{data.email || "No Email"}</p>

          <span className="inline-flex items-center gap-2 mt-2 text-sm bg-purple-100 text-one px-3 py-1 rounded-full">
            <FaCrown />
            {t("Organiztion")}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100"
          >
            <CiLogout className="text-2xl text-red-500" />
          </button>

          <button
            onClick={() => navigate("/organizeation/AddInformationor")}
            className="p-2 rounded-full hover:bg-blue-100"
          >
            <FaUserEdit className="text-2xl text-blue-500" />
          </button>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          ["Phone", data.phone],
          ["Gender", data.gender],
          ["Total Hours", data.total_hours],
          ["Events", data.total_events],
          ["Tasks", data.total_tasks],
          ["Status", data.account_status],
          ["Year", data.year],
          ["Country", data.country?.name],
          ["City", data.city?.name],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{t(label)}</p>
            <p className="text-lg font-medium text-one">{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex justify-center mt-8 mb-6">
        <div className="bg-white shadow-sm p-1 rounded-full flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm transition
              ${
                activeTab === tab.id
                  ? "bg-one text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* EVENTS */}
        {activeTab === "events" &&
          (data?.events?.length ? (
            data.events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={event.image_link}
                  alt=""
                  className="h-40 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-one">{event.name}</h3>

                  <p className="text-sm text-gray-500">{event.description}</p>

                  <p className="text-sm">📅 {event.date}</p>
                  <p className="text-sm">📍 {event.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {t("Noeventsfound")}
            </p>
          ))}

        {/* TASKS */}
        {activeTab === "tasks" &&
          (data?.tasks?.length ? (
            data.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={task.image_link}
                  className="h-40 w-full object-cover"
                  alt=""
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-one">{task.name}</h3>

                  <p className="text-sm text-gray-500">{task.description}</p>

                  <p className="text-sm">📅 {task.date}</p>
                  <p className="text-sm">👥 {task.number_of_voo_needed}</p>
                  <p className="text-sm">⚡ {task.status}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {t("Notasksfound")}
            </p>
          ))}
      </div>
    </div>
  );
};

export default InformationOr;
