import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GetLocationLink = ({ onLocationChange, setnamegoogle, google, defaultLocation }) => {
  const [showMap, setShowMap] = useState(true);
  const [position, setPosition] = useState(defaultLocation || null);
  const [placeName, setPlaceName] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");

  useEffect(() => {
    if (google?.lat && google?.lng) {
      setPosition({ lat: google.lat, lng: google.lng });
      const fullLink = `https://maps.google.com/?q=${google.lat},${google.lng}`;
      setGoogleMapLink(fullLink);
      fetchPlaceName(google.lat, google.lng, fullLink);
    } else if (defaultLocation?.lat && defaultLocation?.lng) {
      setPosition({ lat: defaultLocation.lat, lng: defaultLocation.lng });
      const fullLink = `https://maps.google.com/?q=${defaultLocation.lat},${defaultLocation.lng}`;
      setGoogleMapLink(fullLink);
      fetchPlaceName(defaultLocation.lat, defaultLocation.lng, fullLink);
    }
  }, [google, defaultLocation]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const fullLink = `https://maps.google.com/?q=${lat},${lng}`;
        setPosition({ lat, lng });
        setGoogleMapLink(fullLink);
        fetchPlaceName(lat, lng, fullLink);
      },
    });
    return null;
  };

  const fetchPlaceName = async (lat, lng, fullLink) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const name = data.display_name || "اسم غير معروف";
      console.log("Place Name from API:", name);
      setPlaceName(name);
      onLocationChange?.({ lat, lng, name, url: fullLink });
      setnamegoogle(fullLink);
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
        onClick={() => setShowMap(!showMap)}
        className="w-full h-[48px] md:h-[72px] border-1 text-one font-bold border-two rounded-[8px] placeholder-seven"
      >
        Location
      </button>

      {showMap && (
        <div className="w-full h-[300px] mt-4">
          <MapContainer
            center={
              position ? [position.lat, position.lng] : [30.033333, 31.233334]
            }
            zoom={position ? 10 : 6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {position && (
              <Marker position={[position.lat, position.lng]} icon={customIcon} />
            )}
          </MapContainer>
        </div>
      )}

      {googleMapLink && (
        <div className="mt-4">
          <p className="mb-1 text-gray-700 font-semibold">📍google map link  :</p>
          <a
            href={googleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {googleMapLink}
          </a>
        </div>
      )}

      {placeName  && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>📌 place name :</strong> {placeName}
        </div>
      )}
    </div>
  );
};

export default GetLocationLink;