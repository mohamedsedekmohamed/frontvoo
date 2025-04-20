import React from 'react';

const IconDash = ({ icon ,tone,width,height}) => {


  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill={tone}
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:fill-[#1E1E2F]"
    >
      <path d={icon}  />
    </svg>
  );
};

export default IconDash;
