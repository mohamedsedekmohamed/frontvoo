import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { PiUsersFourFill } from "react-icons/pi";
import { Button } from "@mui/material";

const COLORS = ["#730FC9","#E8E8EA"];

const PieChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(false); 
     const { t, i18n } = useTranslation();

 useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("https://backndVoo.voo-hub.com/api/ornization/Home", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const rawData = res.data.gender;

      const formattedData = Object.entries(rawData).map(([key, value]) => ({
        name: key,
        percent: parseFloat(value),
      }));

      setData(formattedData);
    })
    .catch((err) => {
      console.error("Error fetching pie data", err);
      setError(true);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  return (
 <div
  style={{
    width: "100%",
    height: 400,
    position: "relative",
    background: "#F7F3FB",
    padding: "2rem",
    borderRadius: "8px",
  }}
>
 <div className=" flex items-center text-[#4C4C4D] gap-2 ">
  <i className="text-2xl"><PiUsersFourFill/></i>
   <h2 className="text-center text-lg font-semibold text-gray-700 ">
    Volunteer Distribution by Gender
  </h2>
 </div>
  {loading ? (
    <p style={{ textAlign: "center", marginTop: 150 }}>{t("Loading")}</p>
  ) : error ? (
    <p style={{ textAlign: "center", marginTop: 150, color: "red" }}>
      حدث خطأ أثناء تحميل البيانات
    </p>
  ) : data.length > 0 ? (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="percent"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell style={{padding:"2"}} key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <div style={{ textAlign: "center", marginTop: 150 }}>
      <p className="text-one">No Complaints Analysis</p>
    </div>
  )}
</div>

  );
};

export default PieChartComponent;
