import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GetLocationLink = ({ onLocationChange ,setnamegoogle,google }) => {
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        setGoogleMapLink(url);
        fetchPlaceName(lat, lng, url);
      },
    });
    return null;
  };

  const fetchPlaceName = async (lat, lng, url) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data.display_name) {
        setPlaceName(data.display_name);
        // بناء رابط جوجل ماب يتضمن اسم المكان
        const fullGoogleMapLink = `https://www.google.com/maps?q=${lat},${lng})`;
        setGoogleMapLink(fullGoogleMapLink);
        onLocationChange?.({
          lat,
          lng,
          name: data.display_name,
          url: fullGoogleMapLink,
        });
        setnamegoogle(googleMapLink)
      } else {
        setPlaceName("لم يتم العثور على اسم هذا المكان.");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setPlaceName("حدث خطأ أثناء جلب اسم المكان.");
    }
  };

  const customIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="p-4 w-full h-fit">
      <button
        onClick={() => setShowMap(true)}
        className="w-full h-[48px] md:h-[72px] border-1 text-one font-bold border-two rounded-[8px] placeholder-seven"
      >
        Location
      </button>

      {showMap && (
        <div className="w-full h-[300px] mt-4">
          <MapContainer
            center={[30.033333, 31.233334]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {position && (
              <Marker position={[position.lat, position.lng]} icon={customIcon} />
            )}
          </MapContainer>
        </div>
      )}

      {google && (
        <div className="mt-4">
          <p className="mb-1 text-gray-700 font-semibold">📍 رابط جوجل ماب:</p>
          <a
            href={googleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {googleMapLink||google}
          </a>
        </div>
      )}
    </div>
  );
};

export default GetLocationLink;
