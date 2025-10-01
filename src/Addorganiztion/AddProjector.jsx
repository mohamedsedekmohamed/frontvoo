import React, { useEffect, useState } from "react";
import AddAll from "../ui/AddAll";
import InputField from "../ui/InputField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddProjector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setid] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
 const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      setid(sendData);
      setEdit(true);

      const token = localStorage.getItem("token");
      axios
        .get(
          `https://backndvoo.voo-hub.com/api/ornization/project/item/${sendData}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const pro = response.data.project
          if (pro) {
            setName(pro.name || "");
            setDescription(pro.description || "");
          }
        })
        .catch((error) => {
          toast.error("Error fetching project:", error);
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "description") setDescription(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = "name is required";
    if (!description) formErrors.description = "description is required";
    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    const newUsers = {
      name,
      description,
    };
    if (edit) {
      axios
        .post(
          `https://backndVoo.voo-hub.com/api/ornization/project/update/${id}`,
          newUsers,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          toast.success("project updated successfully");
          setTimeout(() => {
            navigate(-1);
          }, 1500);
             setName("");
    setDescription("");
    setid("");
    setEdit(false);
        })
       .catch((error) => {
        const errors = error?.response?.data;
      
        if (errors && typeof errors === 'object') {
          const firstKey = Object.keys(errors)[0]; 
          const firstMessage = errors[firstKey]?.[0];
      
          if (firstMessage) {
            toast.error(firstMessage);
          } else {
            toast.error("Something went wrong.");
          }
        } else {
          toast.error("Something went wrong.");
        }
      });
      
      return;
    }
    axios
      .post(
        "https://backndVoo.voo-hub.com/api/ornization/project/add",
        newUsers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("project added successfully");
        setTimeout(() => {
          navigate(-1);
        }, 1500);
           setName("");
    setDescription("");
    setid("");
    setEdit(false);
      })
      .catch((error) => {
       const errors = error?.response?.data;
     
       if (errors && typeof errors === 'object') {
         const firstKey = Object.keys(errors)[0]; 
         const firstMessage = errors[firstKey]?.[0];
     
         if (firstMessage) {
           toast.error(firstMessage);
         } else {
           toast.error("Something went wrong.");
         }
       } else {
         toast.error("Something went wrong.");
       }
     });
     
 
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
    <div>
      <ToastContainer />
      <AddAll name={edit ? t("EditProject") : t("AddProject")} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder={t("Name")}
          name="name"
          value={name}
          onChange={handleChange}
        />
        <InputField
          placeholder={t("Description")}
          name="description"
          value={description}
          onChange={handleChange}
        />
      </div>
      <div className="flex mt-6">
        <button
          className="w-[300px] text-[32px] text-white
         transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl"
          onClick={handleSave}
        >
                    {t("Done")}

        </button>
      </div>
    </div>
  );
};

export default AddProjector;
