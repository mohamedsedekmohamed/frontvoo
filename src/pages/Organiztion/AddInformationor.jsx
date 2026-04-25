import React, { useEffect, useState } from "react";
import AddAll from "../../ui/AddAll";
import InputField from "../../ui/InputField";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import FileUploadButton from "../../ui/FileUploadButton";
import { useTranslation } from "react-i18next";

const AddInformationor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [flag, setFlag] = useState(null);
  const [checkflag, setcheckFlag] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    city: "",
    email: "",
    password: "",
  });

  const handleFileChange = (file) => {
    if (file) setFlag(file);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user = response.data.Orgnization;
        setName(user.name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
        setPassword(user.password || "");
        setFlag(user.avatar_image_link || "");
        setcheckFlag(user.avatar_image_link || "");
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);
    if (name === "phone") setPhone(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!name) formErrors.name = t("Name is required");
    if (!flag) formErrors.image = t("Image is required");

    if (!phone) {
      formErrors.phone = t("Phone is required");
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone = t(
        'Phone should contain only numbers or start with "+"',
      );
    }

    if (!email.includes("@gmail.com")) {
      formErrors.email = t("Email should contain @gmail.com");
    }

    if (password && password.length < 8) {
      formErrors.password = t("Password must be at least 8 characters");
    }

    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    const newUser = {
      name,
      phone,
      email,
    };

    if (checkflag !== flag) newUser.avatar_image = flag;
    if (password) newUser.password = password;

    axios
      .put(
        "https://backndVoo.voo-hub.com/api/ornization/profile/update",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success(t("Organization updated successfully"));
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      })
      .catch((error) => {
        const errors = error?.response?.data;

        if (errors && typeof errors === "object") {
          const firstKey = Object.keys(errors)[0];
          const firstMessage = errors[firstKey]?.[0];

          toast.error(firstMessage || t("Something went wrong"));
        } else {
          toast.error(t("Something went wrong"));
        }
      });

    setName("");
    setPhone("");
    setFlag(null);
    setEmail("");
    setPassword("");
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
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Header */}
      <AddAll name={t("Edit Organization")} navGo={-1} />

      <div className="mt-6 bg-white rounded-2xl shadow-md p-6 md:p-10 max-w-5xl mx-auto">
        {/* Organization Info */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("Organization Information")}
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            placeholder={t("Organization Name")}
            name="name"
            value={name}
            onChange={handleChange}
          />

          <InputField
            placeholder={t("Phone")}
            name="phone"
            value={phone}
            onChange={handleChange}
          />

          <InputField
            placeholder={t("Email")}
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        {/* Logo */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">{t("Organization Logo")}</p>

          <FileUploadButton
            name="flag"
            kind="flag"
            flag={flag}
            onFileChange={handleFileChange}
          />
        </div>

        {/* Security */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
          {t("Security")}
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <InputField
            placeholder={t("New Password")}
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        {/* Save */}
        <div className="flex justify-start mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 h-14 bg-one text-white rounded-xl font-semibold text-lg transition hover:scale-[0.97] active:scale-[0.95] shadow-md disabled:opacity-60"
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInformationor;
