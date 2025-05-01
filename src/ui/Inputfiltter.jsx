import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from 'react-i18next';

const Inputfiltter = ({ placeholder, value, like, onChange, name, shara }) => {
  const [arrThing, setArrthing] = useState([]);
  const [control, setControl] = useState(name);

  const {  i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  useEffect(() => {
    setControl(name);
    const token = localStorage.getItem('token');
    if (name === "gender") {
      const typeArray = [
        { name: "male" },
        { name: "female" }]
      setArrthing(typeArray)
    }
    axios.get(`https://backndVoo.voo-hub.com/api/admin/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      if (name === "city") {
        const filteredCities = response.data.cities
          .filter(city => city.country_id == shara)
          .map(city => ({
            name: city.name,
            id: city.id,
          }));
        setArrthing(filteredCities);
      } else if (name === "zone") {
        const filteredZones = response.data[0].zones
          .filter(zone => zone.city_id == shara)
          .map(zone => ({
            name: zone.name,
            id: zone.id,
          }));
          console.log(filteredZones)
        setArrthing(filteredZones);
      }
    });
    
  }, [name, shara]);

  // تعديل مكان السهم حسب اللغة
  const shape = like
    ? `absolute top-[60%] md:left-65 w-[18px] h-[24px] transition group-focus-within:rotate-90 ${!isArabic ? 'left-10' : 'left-43'}`
    : `absolute top-[60%] w-[18px] h-[24px] transition group-focus-within:rotate-90 ${!isArabic ? 'right-4' : 'left-4'}`;

return (
  <div className="relative group flex flex-col gap-3 items-start justify-center">
    <IoIosArrowDown className={shape} />
    <span className='font-bold  text-one'>{placeholder}</span>
    <select
      id="options"
      value={value}
      onChange={onChange}
      name={name}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        paddingRight: '20px',
        backgroundImage: 'none',
      }}
      className=" w-50 h-12 md:w-[300px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
    >
      <option value="">{placeholder}</option> {/* قيمة افتراضية */}
      {arrThing && arrThing.length > 0 && arrThing.map((item, index) => {
        if (control === "city") {
          return (
            <option key={index} value={item.id}>
              {item.name}
            </option>
            );
        }
       else if (control === "gender") {
          return (
            <option key={index} value={item.name}>
              {item.name}
            </option>
            );
        }
       else if (control === "zone") {
          return (
            <option key={index} value={item.id}>
              {item.name}
            </option>
            );
        }
        else {
          return null;
        }
      })}
    </select>
  </div>
);
};

export default Inputfiltter;