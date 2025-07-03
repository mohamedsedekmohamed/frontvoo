import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";

const MultiSelectDropdown = ({ placeholder, selectedValues = [], name, onChange }) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://backndVoo.voo-hub.com/api/admin/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(response => {
      if (name === "notification") {
        const users = response.data.users;
        setOptions(users);
        setFilteredOptions(users);
      }
    }).catch(err => {
      console.error(err);
    });
  }, [name]);

  useEffect(() => {
    const filtered = searchTerm
      ? options.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (itemId) => {
    const updatedValues = selectedValues.includes(itemId)
      ? selectedValues.filter(id => id !== itemId)
      : [...selectedValues, itemId];
    onChange(updatedValues);
  };

  const getItemName = (id) => {
    const item = options.find(item => item.id === id);
    return item ? item.name : '';
  };

  const handleRemoveItem = (id) => {
    const updated = selectedValues.filter(item => item !== id);
    onChange(updated);
  };

  const handleSelectAll = () => {
    const allIds = filteredOptions.map(opt => opt.id);
    onChange(allIds);
  };

  return (
    <div ref={dropdownRef} className="relative group flex flex-col gap-3 items-start justify-center">
      <span className='font-bold text-one'>{placeholder}</span>

      <div 
        className={`w-[250px] md:w-[320px] min-h-[48px] md:min-h-[72px] border border-two rounded-[8px] px-3 pr-10 py-2 flex flex-wrap items-center gap-2 cursor-pointer ${isOpen ? 'border-primary' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
     {selectedValues.slice(0, 3).map(id => (
  <span key={id} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
    {getItemName(id)}
    <span onClick={(e) => {
      e.stopPropagation();
      handleRemoveItem(id);
    }} className="cursor-pointer text-red-500">×</span>
  </span>
))}
{selectedValues.length > 3 && (
  <span className="text-sm text-gray-600">+{selectedValues.length - 3} more</span>
)}
        <IoIosArrowDown className={`absolute right-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-[250px] md:w-[320px] bg-white border border-two rounded-[8px] shadow-lg z-10">
          <div className="flex justify-between items-center px-3 py-2 border-b border-two">
            <button onClick={handleSelectAll} className="text-blue-600 text-sm">Select All</button>
            <button onClick={() => onChange([])} className="text-red-500 text-sm">Clear</button>
          </div>

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
                <label
                  key={item.id}
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                  <span>{item.name}</span>
                </label>
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

export default MultiSelectDropdown;
