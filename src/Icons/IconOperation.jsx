import React from 'react'

const IconOperation = ({ variant }) => {
  const fillColor = variant ? '#730FC9' : 'white';

  return (
    <div>
      <svg width="20" height="22" viewBox="0 0 20 22" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
        <mask 
          id="mask0_509_6155" 
          mask-type="luminance" 
          maskUnits="userSpaceOnUse" 
          x="0" 
          y="0" 
          width="20" 
          height="22"
        >
          <path 
            d="M1 1.38892H10V17.3889H1V1.38892ZM10 4.38892H19V20.3889H10V4.38892Z"
            fill={fillColor}
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M4.5 7.38892L6.5 9.28392L4.6665 11.3889M15.5 10.3889L13.5 12.2839L15.3335 14.3889"
            stroke="black" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </mask>
        <g mask="url(#mask0_509_6155)">
          <path 
            d="M-2 -1.11108H22V22.8889H-2V-1.11108Z" 
            fill={fillColor} 
          />
        </g>
      </svg>
    </div>
  );
}

export default IconOperation;
