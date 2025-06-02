import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// حل مشكلة أيقونة Marker
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPicker = ({ location, onLocationChange, height = '500px' }) => {
  const mapRef = useRef(null);
  const [placeName, setPlaceName] = useState('');
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // تهيئة الخريطة
    const map = L.map(mapRef.current).setView([location.lat, location.lng], 15);
    mapInstance.current = map;

    // إضافة طبقة الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // إنشاء علامة
    const marker = L.marker([location.lat, location.lng], {
      draggable: true,
      autoPan: true
    }).addTo(map)
      .bindPopup("الموقع المحدد")
      .openPopup();
    markerRef.current = marker;

    // أحداث الخريطة
    map.on('click', (e) => {
      updateLocation(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', (e) => {
      const newPos = marker.getLatLng();
      updateLocation(newPos.lat, newPos.lng);
    });

    // إضافة عناصر التحكم
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale().addTo(map);

    // جلب اسم المكان الأولي
    fetchPlaceName(location.lat, location.lng);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && markerRef.current) {
      mapInstance.current.setView([location.lat, location.lng]);
      markerRef.current.setLatLng([location.lat, location.lng]);
      fetchPlaceName(location.lat, location.lng);
    }
  }, [location]);

  const updateLocation = (lat, lng) => {
    const newLocation = { lat, lng };
    onLocationChange(newLocation);
    fetchPlaceName(lat, lng);
  };

  const fetchPlaceName = (lat, lng) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          setPlaceName(data.display_name);
        }
      })
      .catch(error => console.error('Error fetching place name:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onLocationChange({ 
        ...location, 
        [name]: numValue 
      });
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      {/* شريط التحكم العلوي */}
      <div className="bg-one text-white p-3">
        <h1 className="text-xl font-bold text-center">  Location on the map </h1>
      </div>

      {/* الخريطة */}
      <div 
        ref={mapRef}
        className="w-full"
        style={{ height }}
      ></div>

      {/* لوحة التحكم السفلية */}
      <div className="bg-gray-100 p-4 border-t border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-one mb-1">
             (Latitude):
            </label>
            <input
              type="number"
              name="lat"
value={typeof location.lat === 'number' ? location.lat.toFixed(6) : ''}
              onChange={handleInputChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-one mb-1">
            (Longitude):
            </label>
            <input
              type="number"
              name="lng"
value={typeof location.lng === 'number' ? location.lng.toFixed(6) : ''}
              onChange={handleInputChange}
              step="0.000001"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* اسم المكان المحدد */}
        {placeName && (
          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
            <p className="text-sm text-one">
              <span className="font-medium">Place name:</span> 
              
              <span className="text-sm text-black">
                {placeName}
                
                </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPicker;