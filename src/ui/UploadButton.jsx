import React, { useState, useEffect } from 'react';
import { MdOutlineCloudDownload } from "react-icons/md";

const UploadButton = ({ onFileChange, kind, flag }) => {
  const [showed, setShowed] = useState(flag);
  const [error, setError] = useState('');

  // نحدث المعاينة فقط إذا كان الـ flag نصاً (رابط من السيرفر) 
  // أو إذا تغيرت البيانات عند التحميل في حالة التعديل
  useEffect(() => {
    if (typeof flag === 'string') {
      setShowed(flag);
    }
  }, [flag]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split('/')[0];
      if (fileType === 'image') {
        // إنشاء رابط المعاينة فوراً للمكون الحالي
        const objectUrl = URL.createObjectURL(selectedFile);
        setShowed(objectUrl); 

        // إرسال الملف (Object) للأب لاستخدامه في FormData
        if (onFileChange) {
          onFileChange(selectedFile);
        }
        
        setError('');
      } else {
        setError('Please upload an image file only');
      }
    }
  };

  return (
    <div className='flex flex-col gap-3 items-start justify-center'>
      <span className='font-bold text-one capitalize'>{kind}</span>

      <input
        type="file"
        accept="image/*"
        id={`file-upload-${kind}`}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button
        type="button"
        className='w-[200px] md:w-[300px] h-[48px] md:h-[72px] border border-two rounded-[8px] flex justify-center items-center overflow-hidden bg-gray-50'
        onClick={() => document.getElementById(`file-upload-${kind}`).click()}
      >
        {!showed ? (
          <div className="flex flex-col items-center text-gray-400">
            <MdOutlineCloudDownload className='w-8 h-8 md:w-10 md:h-10' />
            <span className='text-[12px]'>Upload {kind}</span>
          </div>
        ) : (
          <div className='w-full h-full flex justify-center items-center p-1'>
            <img
              className='h-full w-full object-contain rounded'
              src={showed} 
              alt="Preview"
            />
          </div>
        )}
      </button>

      {error && <div className='text-red-500 text-sm'>{error}</div>}
    </div>
  );
};

export default UploadButton;