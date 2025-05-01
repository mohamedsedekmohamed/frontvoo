import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { useTranslation } from 'react-i18next';

const InputArrow = ({ placeholder, value, like, onChange, name }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [arrayof, setArray] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`https://backndVoo.voo-hub.com/api/orgnization/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        let data = [];
        if (name === "getCountry") data = response.data.countries;
        if (name === "getCity") data = response.data.cities;
        if (name === "getZone") data = response.data[0].zones;
        if (name === "organization") data = response.data.orgnization;
        
        setArray(data);
        setFilteredOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = arrayof.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(arrayof);
    }
  }, [searchTerm, arrayof]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id, name) => {
    onChange({
      target: {
        name: name,
        value: id
      }
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedItem = arrayof.find(item => item.id === value);

  return (
    <div className="relative group flex flex-col gap-3 items-start justify-center" ref={dropdownRef}>
      <span className='font-bold text-one'>{placeholder}</span>
      <div 
        className={`w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10 pr-10 flex items-center cursor-pointer ${isOpen ? 'border-primary' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedItem ? selectedItem.name : placeholder}
        <IoIosArrowDown className={`absolute ${isArabic ? 'left-4' : 'right-4'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-[200px] md:w-[300px] bg-white border border-two rounded-[8px] shadow-lg z-10">
          <div className="p-2 border-b border-two flex items-center">
            <IoIosSearch className="mx-2" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${item.id === value ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelect(item.id, name)}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputArrow;