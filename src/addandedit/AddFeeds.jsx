import React, { useEffect, useState } from "react";
import AddAll from "../ui/AddAll";
import InputField from "../ui/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import FileUploadButton from '../ui/FileUploadButton';
import { FaVideo } from "react-icons/fa";

const AddFeeds = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagetwo, setImagetwo] = useState(null);
  const [video, setVideo] = useState(null);
  const [videotwo, setVideotwo] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [id, setId] = useState("");
 const handleFileChange = (file) => {
    if (file) setImage(file);
  };
  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      setId(sendData);
      setEdit(true);
      const token = localStorage.getItem("token");

      axios
        .get(
          `https://backndVoo.voo-hub.com/api/admin/news_feeds/item/${sendData}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const data = response.data.news_feeds;
          setContent(data.content || "");
          setImagetwo(data.image_link || "");
          setImage(data.image_link || "");
          setVideo(data.video_link || "");
          setVideotwo(data.video_link || "");
          
        })
        .catch((error) => {
          console.error("Error fetching feed:", error);
        });
    }

    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.state]);

  const validateForm = () => {
    let formErrors = {};
    if (!content) formErrors.content = "content";

    Object.values(formErrors).forEach((error) => toast.error(error));
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "content") setContent(value);
    else if (name === "video") setVideo(files?.[0]);
    else if (name === "image") setImage(files?.[0]);
  };

  const handleError = (error) => {
    const errors = error?.response?.data;
    if (errors && typeof errors === "object") {
      const firstKey = Object.keys(errors)[0];
      const firstMessage = errors[firstKey]?.[0];
      toast.error(firstMessage || "Something went wrong.");
    } else {
      toast.error("Something went wrong.");
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", content);
    if (image !==imagetwo) formData.append("image", image);
    if (video!==videotwo) formData.append("video", video);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (edit) {
      axios
        .post(
          `https://backndVoo.voo-hub.com/api/admin/news_feeds/update/${id}`,
          formData,
          config
        )
        .then(() => {
          toast.success("Feeds Updated Successfully");
          setTimeout(() => navigate(-1), 3000);
           setImagetwo(null)
        setVideotwo(null)
    setEdit(false);
    setContent("");
    setImage(null);
    setVideo(null);
        })
        .catch(handleError);
      return;
    }

    axios
      .post(
        "https://backndVoo.voo-hub.com/api/admin/news_feeds/add",
        formData,
        config
      )
      .then(() => {
        toast.success("Feeds Added Successfully" );
        setTimeout(() => navigate(-1), 3000);
         setImagetwo(null)
        setVideotwo(null)
    setEdit(false);
    setContent("");
    setImage(null);
    setVideo(null);
      })
      .catch(handleError);
    
   
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
    <div >
      <ToastContainer />
      <AddAll name={edit ? "Edit Feeds" : "Add Feeds"} navGo={-1} />
      <div className="flex flex-wrap gap-6 mt-6">
        {/* Content input */}
        <InputField
          placeholder="content"
          name="content"
          value={content}
          onChange={handleChange}
        />

       <FileUploadButton
           name="image"
           kind="image"
           flag={image}
           onFileChange={handleFileChange}
        />
        <div className="flex flex-col gap-2">
          <span className="font-bold text-one">UploadVideo </span>

          <label
            htmlFor="video-upload"
            className="cursor-pointer w-[200px] md:w-[300px] h-[48px] md:h-[72px] border border-two rounded-[8px] flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 transition"
          >
            <FaVideo className="text-xl" />
            <span>  {video?"done":"UploadVideo"} </span>
          </label>

          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="hidden"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-[200px] md:w-[300px] h-[48px] md:h-[72px] bg-one text-white rounded-[8px] text-lg font-medium mt-2 hover:bg-opacity-90 transition"
        >
          {edit ?"Edit" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AddFeeds;
