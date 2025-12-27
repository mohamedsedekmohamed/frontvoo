import React from 'react';
import { TbReportAnalytics } from "react-icons/tb";

const IconEvaluation = ({ variant = false }) => {

  const iconColor = variant ? '#730FC9' : '#FFFFFF';

  return (
    <div
    >
      <TbReportAnalytics 
        style={{ color: iconColor }} 
        className="w-7 h-7 "
      />
    </div>
  );
};

export default IconEvaluation;