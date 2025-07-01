import React, { useEffect, useState } from "react";
import AddAll from "../ui/AddAll";
import InputField from "../ui/InputField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import InputArrow from "../ui/InputArrow";
import Inputfiltter from "../ui/Inputfiltter";
import SwitchButton from "../ui/SwitchButton";

const Addorganizeation = () => {
  const [status, setStatus] = useState("inactive");

  const navigate = useNavigate();
  const location = useLocation();
  const [country, setCountry] = useState("");
  const [id, setid] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    organization: "",
    country: "",
    phone: "",
    city: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      console.log(sendData); // ده هيكون الـ id نفسه
      setid(sendData); // مش sendData.id، لأنه id مباشرة
      setEdit(true);

      const token = localStorage.getItem("token");
      axios
        .get("https://backndVoo.voo-hub.com/api/admin/organization", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const user = response.data.orgnization.find((u) => u.id === sendData);
          console.log(user);
          if (user) {
            setOrganization(user.name || "");
            setPhone(user.phone || "");
            setCountry(user.country_id || "");
            setCity(user.city_id || "");
            setEmail(user.email || "");
            setStatus(user.account_status || "");
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "organization") setOrganization(value);
    if (name === "phone") setPhone(value);
    if (name === "country") setCountry(value);
    if (name === "city") setCity(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!organization) formErrors.name = "organization is required";
    if (!phone) {
      formErrors.phone = "Phone is required";
    } else if (!/^\+?\d+$/.test(phone)) {
      formErrors.phone =
        'Phone should contain only numbers or start with a "+"';
    }
    if (!country) formErrors.country = "Country is required";
    if (!city) formErrors.city = "City is required";
    if (!email.includes("@gmail.com"))
      formErrors.email = "Email should contain @gmail.com";
    if (!edit && password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
    }

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
    const newUser = {
      name: organization,
      phone,
      country_id: country,
      city_id: city,
      email,
            account_status:status

    };

    if (!edit || !password) {
      newUser.password = password;
    }

    if (edit) {
      axios
        .put(
          `https://backndVoo.voo-hub.com/api/admin/organization/update/${id}`,
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          toast.success("organization updated successfully");
          setTimeout(() => {
            navigate(-1);
          }, 3000);
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
        "https://backndVoo.voo-hub.com/api/admin/organization/add",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("organization  added successfully");
        setTimeout(() => {
          navigate(-1);
        }, 3000);
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
    setStatus("inactive")

    setOrganization("");
    setPhone("");
    setCountry("");
    setCity("");
    setEmail("");
    setPassword("");
    setEdit(false);
    setid("");
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
      <AddAll
        name={edit ? "Edit organization" : "Add organization"}
        navGo={-1}
      />

      <div className="flex flex-wrap gap-6 mt-6">
        <InputField
          placeholder="organization"
          name="organization"
          value={organization}
          onChange={handleChange}
        />

        <InputField
          placeholder="Phone"
          name="phone"
          value={phone}
          onChange={handleChange}
        />
        <InputField
          placeholder="Gmail"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <InputArrow
          placeholder="Country"
          name="country"
          value={country}
          onChange={handleChange}
          required
        />
        <Inputfiltter
          placeholder="city"
          name="city"
          value={city}
          onChange={handleChange}
          shara={country}
        />
        <InputField
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        
      </div>
 <div className='flex justify-center m-5 items-end'>
              <SwitchButton value={status} title='status' setValue={setStatus} />
      </div>
      <div className="flex mt-6">
        <button
          className="transition-transform hover:scale-95 w-[300px] text-[32px] text-white font-medium h-[72px] bg-one rounded-2xl"
          onClick={handleSave}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Addorganizeation;
