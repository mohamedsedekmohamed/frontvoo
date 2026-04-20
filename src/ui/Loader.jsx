import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        {/* الدائرة المتحركة - تم استخدام لون 'one' الذي تعتمد عليه في مشروعك */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-one rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;