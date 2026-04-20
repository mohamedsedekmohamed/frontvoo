import React from 'react';
import { BiErrorCircle } from "react-icons/bi"; 

const ErrorPage = ({ onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4 text-center p-6 bg-red-50 border border-red-100 rounded-xl">
        <BiErrorCircle className="text-red-500 w-16 h-16" />
        <h2 className="text-2xl font-bold text-gray-800">Failed to load data!</h2>
        
        <p className="text-gray-600 max-w-md">
          We encountered an issue while trying to fetch the data from the server. Please try again.
        </p>
        
        {/* زر إعادة المحاولة - يقوم بتشغيل دالة جلب البيانات مرة أخرى */}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 px-6 py-2 bg-one text-white rounded-lg hover:bg-opacity-90 transition shadow-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;