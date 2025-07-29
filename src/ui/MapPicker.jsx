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

    // حالات البحث
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

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
      fetchPlaceName(location.lat, location.lng, (name) => {
        setSearchQuery(name); // تحديث شريط البحث بالاسم الأولي
      });

      return () => {
        map.remove();
      };
    }, []);

    useEffect(() => {
      if (mapInstance.current && markerRef.current) {
        mapInstance.current.setView([location.lat, location.lng]);
        markerRef.current.setLatLng([location.lat, location.lng]);
        fetchPlaceName(location.lat, location.lng, (name) => {
          setSearchQuery(name); // تحديث شريط البحث عند تغيير الموقع برمجياً
        });
      }
    }, [location]);

    const updateLocation = (lat, lng) => {
      const newLocation = { lat, lng };
      onLocationChange(newLocation);
      // جلب اسم المكان وتحديث شريط البحث
      fetchPlaceName(lat, lng, (name) => {
        setSearchQuery(name);
      });
    };

    // تم تعديل هذه الدالة لقبول 'callback'
    const fetchPlaceName = (lat, lng, callback = () => {}) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            setPlaceName(data.display_name);
            callback(data.display_name); // استدعاء الـ callback بالاسم الجديد
          }
        })
        .catch(error => console.error('Error fetching place name:', error));
    };

    // دالة البحث (autocomplete)
    useEffect(() => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const controller = new AbortController();

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`, {
        signal: controller.signal
      })
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Search error:', err);
            setLoading(false);
          }
        });

      // تنظيف الطلب عند تغير البحث
      return () => controller.abort();
    }, [searchQuery]);

    // اختيار نتيجة البحث
    const handleSelectResult = (result) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      onLocationChange({ lat, lng });
      setSearchQuery(result.display_name); // تحديث شريط البحث بالاسم الكامل للنتيجة المختارة
      setSearchResults([]);
    };

    // تغيير نص البحث
    const handleInputChange = (e) => {
      setSearchQuery(e.target.value);
    };

    // تغيير الإحداثيات يدويًا
    const handleCoordChange = (e) => {
      const { name, value } = e.target;
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const newLocation = { 
          ...location, 
          [name]: numValue 
        };
        onLocationChange(newLocation);
        // بعد تحديث الإحداثيات يدوياً، قم بجلب اسم المكان وتحديث شريط البحث
        fetchPlaceName(newLocation.lat, newLocation.lng, (name) => {
          setSearchQuery(name);
        });
      }
    };

    return (
      <div className="flex w-full flex-col bg-white rounded-xl shadow-xl overflow-hidden relative" style={{ minHeight: '600px', fontFamily: "'Inter', sans-serif" }}>
        {/* العنوان */}
        <div className="bg-one text-white p-5 font-bold text-xl text-center tracking-wide rounded-t-xl">
Locate on the map
    </div>

        {/* الخريطة + البحث */}
        <div ref={mapRef} className="w-full relative" style={{ height }}>
          {/* مربع البحث */}
          <div
            className="absolute top-5 left-5 right-5 z-[1100] bg-white p-4 rounded-xl shadow-xl"
            style={{
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="ابحث عن مكان..."
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium placeholder-gray-400"
                autoComplete="off"
              />
              {loading && (
                <div className="absolute right-3 top-3.5">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            {searchResults.length > 0 && (
              <ul className="mt-3 max-h-60 overflow-y-auto border border-blue-200 rounded-lg shadow-lg bg-white">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    onClick={() => handleSelectResult(result)}
                    className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-gray-700 hover:text-blue-700"
                  >
                    <div className="font-medium">{result.display_name.split(',')[0]}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.display_name.split(',').slice(1).join(',')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* الإحداثيات اليدوية */}
        {/* <div className="p-5 bg-gray-50 rounded-b-xl border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 text-gray-700">
          <div className="flex-1 w-full">
            <label htmlFor="latitude" className="block text-sm font-semibold mb-1 text-gray-600">خط العرض:</label>
            <input
              id="latitude"
              type="number"
              name="lat"
              value={location.lat}
              onChange={handleCoordChange}
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="longitude" className="block text-sm font-semibold mb-1 text-gray-600">خط الطول:</label>
            <input
              id="longitude"
              type="number"
              name="lng"
              value={location.lng}
              onChange={handleCoordChange}
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium"
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="placeName" className="block text-sm font-semibold mb-1 text-gray-600">اسم المكان:</label>
            <input
              id="placeName"
              type="text"
              value={placeName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium cursor-not-allowed"
            />
          </div>
        </div> */}
      </div>
    );
  };

  export default MapPicker;