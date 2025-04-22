import React, { useState } from "react";

const GetLocationLink = ({ onLocationChange }) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          setError("");

          if (onLocationChange) {
            onLocationChange({ lat, lng, url: generateMapLink(lat, lng) });
          }
        },
        (err) => {
          setError("فشل في تحديد الموقع. تأكد من تفعيل GPS.");
          console.error(err);
        }
      );
    } else {
      setError("المتصفح لا يدعم تحديد الموقع.");
    }
  };

  const generateMapLink = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="p-4 w-full flex flex-col gap-2 items-start">
      <button
        onClick={getLocation}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        حدد موقعي
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {coords && (
        <div>
          <p>📍 الإحداثيات:</p>
          <p>خط العرض: {coords.lat}</p>
          <p>خط الطول: {coords.lng}</p>
          <a
            href={generateMapLink(coords.lat, coords.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            افتح موقعي على الخريطة
          </a>
        </div>
      )}
    </div>
  );
};

export default GetLocationLink;
