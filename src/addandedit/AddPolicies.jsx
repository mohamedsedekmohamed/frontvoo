import React, { useEffect, useState } from "react";
import AddAll from "../ui/AddAll";
import InputField from "../ui/InputField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
const AddPolicies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState("");
  const [errors, setErrors] = useState({
    policy: "",
  });
  useEffect(() => {
    const { sendData } = location.state || {};
    setPolicy(sendData.value);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);
  const validateForm = () => {
    let formErrors = {};
    if (!policy) formErrors.policy = "policy is required";
    Object.values(formErrors).forEach((error) => {
      toast.error(error);
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "policies") setPolicy(value);
  };
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post(`https://backndvoo.voo-hub.com/api/admin/policy/update`, {policy}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("policy updated successfully");
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      })
      .catch(() => {
        toast.error("Failed network");
      });
      setPolicy('')
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
      <AddAll name="Edit Policy" navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="Policies"
          name="policies"
          value={policy}
          onChange={handleChange}
        />
      </div>
      <div className="flex mt-6">
        <button
          className="w-[300px] text-[32px] text-white
                 transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl"
          onClick={handleSave}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AddPolicies;
