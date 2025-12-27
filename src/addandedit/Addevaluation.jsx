import React, { useEffect, useState } from 'react';
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUploadButton from '../ui/FileUploadButton';
import UploadButton from '../ui/UploadButton';

const Addevaluation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [image, setImage] = useState(null);
  const [checkImage, setCheckImage] = useState(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [evaluationText, setEvaluationText] = useState('');
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // التعامل مع رفع الصورة
const handleFileChange = (file) => {
  setImage(file); // سيقوم بتخزين الـ File Object
};

  useEffect(() => {
    const { sendData } = location.state || {};
    if (sendData) {
      setId(sendData);
      setEdit(true);

      const token = localStorage.getItem('token');
      axios.get("https://backndvoo.voo-hub.com/api/admin/evaluation", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        const item = response.data.evaulations.find(u => u.id === sendData);
        if (item) {
          setName(item.name || '');
          setTitle(item.title || '');
          setEvaluationText(item.evaulation || '');
          setImage(item.image_link || null);
          setCheckImage(item.image_link || null);
        }
      })
      .catch(error => {
        toast.error("Error fetching evaluation data");
      });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.state]);

  const validateForm = () => {
    if (!name) { toast.error('Name is required'); return false; }
    if (!title) { toast.error('Title is required'); return false; }
    if (!evaluationText) { toast.error('Evaluation text is required'); return false; }
    if (!image && !edit) { toast.error('Image is required'); return false; }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('title', title);
    formData.append('evaulation', evaluationText);
    
   if (checkImage !== image) {
      formData.append('image', image);
    }

    const url = edit 
      ? `https://backndvoo.voo-hub.com/api/admin/evaluation/update/${id}`
      : `https://backndvoo.voo-hub.com/api/admin/evaluation/add`;

    const method = edit ? 'post' : 'post';

    axios({
      method: method,
      url: url,
      data: formData, // إذا كان الـ API يطلب JSON فقط استبدل formData بكائن عادي
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success(edit ? 'Updated successfully' : 'Added successfully');
      setTimeout(() => navigate(-1), 1500);
    })
    .catch((error) => {
      const errorMsg = error?.response?.data?.message || "Something went wrong.";
      toast.error(errorMsg);
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
      <AddAll name={edit ? "Edit Evaluation" : "Add Evaluation"} navGo={-1} />
      
      <div className="flex flex-col gap-6 mt-6 max-w-[624px]">
        {/* حقل الاسم */}
        <InputField
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* حقل العنوان الوظيفي */}
        <InputField
          placeholder="Title (e.g. Leader)"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* حقل نص التقييم */}
        <InputField
          placeholder="Evaluation Text"
          name="evaluationText"
          value={evaluationText}
          onChange={(e) => setEvaluationText(e.target.value)}
        />

        {/* زر رفع الصورة */}
        <UploadButton
          name="image"
          kind="image"
          flag={image} // نمرر image هنا ليقوم المكون بعرضها
          onFileChange={handleFileChange}
        />
      </div>

      <div className="flex mt-10">
        <button 
          className='w-[300px] text-[28px] text-white transition-transform hover:scale-95 font-medium h-[64px] bg-one rounded-2xl' 
          onClick={handleSave}
        >
          {edit ? "Update" : "Done"}
        </button>
      </div>
    </div>
  );
};

export default Addevaluation;