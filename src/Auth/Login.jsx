import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Loginpic from "../assets/login.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Voologo from "../assets/Voologo.png";

function Login({ setIsLoggedIn, setorganiztionLayout }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  // التحقق من صحة الإيميل
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    // التحقق قبل الإرسال
    if (!username) {
      toast.error("Email is required");
      return;
    }
    if (!isValidEmail(username)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    axios
      .post("https://backndVoo.voo-hub.com/api/login", {
        email: username,
        password: password,
      })
      .then((response) => {
        if (response.data.user.role === "admin") {
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome Admin!");
          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(false);
            navigate("/admin/home");
          }, 2000);
        } else if (response.data.user.role === "organization") {
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome Organization!");
          setTimeout(() => {
            setIsLoggedIn(true);
            setorganiztionLayout(true);
            navigate("/organiztion/home");
          }, 2000);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.data) {
          const errors = error.response.data;

          // حالة لو فيه key واحد اسمه error (string)
          if (errors.error) {
            toast.error(errors.error);
            return;
          }

          // حالة لو جاي object زي { email: ["..."], password: ["..."] }
          if (typeof errors === "object") {
            Object.keys(errors).forEach((field) => {
              const messages = errors[field];
              if (Array.isArray(messages)) {
                messages.forEach((msg) => toast.error(msg));
              } else {
                toast.error(messages); // لو كان string مش array
              }
            });
          } else {
            toast.error(errors);
          }
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* LEFT SIDE (FORM) */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => navigate("/")}>
              <img src={Voologo} alt="logo" className="h-10" />
            </button>
            <span className="text-xl font-semibold text-one">Voo</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">Welcome back 👋</h1>
          <p className="text-gray-500 mt-2 mb-6">Login to continue</p>

          {/* Email */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email address"
            className="w-full h-14 px-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-one transition"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-one transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full h-14 bg-one text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition hover:scale-[0.97] active:scale-[0.95] disabled:opacity-60"
          >
            {loading ? (
              <>
                <span>Logging in...</span>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
        <div className="hidden md:block">
          <img
            src={Loginpic}
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
