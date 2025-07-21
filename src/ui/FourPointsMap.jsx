import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// لحل مشكلة الأيقونات
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// كمبوننت لتسجيل الضغطات
function ClickHandler({ onAddPoint }) {
  useMapEvents({
    click(e) {
      onAddPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const FourPointsMap = ({setPoints,points}) => {

  const handleAddPoint = (point) => {
    if (points.length >= 4) return;
    setPoints((prev) => [...prev, point]);
  };

  const handleReset = () => {
    setPoints([]);
  };

  // const sendToServer = async () => {
  //   if (points.length !== 4) {
  //     alert("يجب تحديد ٤ نقاط أولاً");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("https://your-api.com/polygon", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ polygon: points }),
  //     });

  //     if (!response.ok) throw new Error("Sending failed");
  //     const data = await response.json();
  //     alert("Sent successfully" );
  //     console.log(data);
  //   } catch (error) {
  //     alert("Error while sending");
  //     console.error(error);
  //   }
  // };

  return (
    <div>
      <MapContainer
        center={[31.200092, 29.918739]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler onAddPoint={handleAddPoint} />

        {/* رسم الماركرات */}
        {points.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}

        {/* رسم المضلع */}
        {points.length === 4 && <Polygon positions={points} color="blue" />}
      </MapContainer>

   <div style={{ marginTop: 20 }}>
  <p>Number of points:{points.length} / 4</p>

  {/* زر المسح */}
  <button
    onClick={handleReset}
    style={{
      padding: "8px 15px",
      backgroundColor: "#730FC9",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      marginRight: "10px",
      cursor: "pointer",
    }}
  >
🧹 Clear points / Redefine  </button>

  {/* زر الإرسال */}
  {/* <button
    onClick={sendToServer}
    disabled={points.length !== 4}
    style={{
      padding: "8px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: points.length === 4 ? "pointer" : "not-allowed",
    }}
  >
📤 Send coordinates  </button> */}


</div>

    </div>
  );
};

export default FourPointsMap;
