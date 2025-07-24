import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FaMapMarkerAlt } from "react-icons/fa";
const VolunteerByCityRadarChart = ({ data = [] }) => {
  const COLORS = ["#730FC9", "#C0A9D6", "#B2A9B6", "#ECECEC", "#333"];

  const chartData = data.map((item, index) => ({
    city: item.city,
    requests: item.users,
    color: COLORS[index % COLORS.length],
  }));

  const maxValue = Math.max(...chartData.map((item) => item.requests), 10);

  return (
    <div
      style={{
        background: "#F7F3FB",
        padding: "1.5rem",
        borderRadius: "1rem",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Legend */}
      <div style={{ flex: "1 1 300px" }}>
        <div className="flex items-center gap-2 text-[#333] mb-4">
          <FaMapMarkerAlt className="text-xl" />
          <h2 className="text-xl font-semibold">Volunteer Distribution By City</h2>
        </div>
        <ul className="space-y-2">
          {chartData.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              ></span>
              <span className="text-[#730FC9] font-medium">
                {item.city} – {item.requests} Volunteers
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Radar Chart */}
      <div style={{ flex: "1 1 400px", height: 300 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="city" />
              <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
              <Radar
                name="Volunteers"
                dataKey="requests"
                stroke="#730FC9"
                fill="#730FC9"
                fillOpacity={0.4}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#730FC9] font-medium text-center mt-4">
            No volunteer data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default VolunteerByCityRadarChart;
