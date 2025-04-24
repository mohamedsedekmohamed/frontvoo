import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const InputArrow = ({ placeholder, value, like, onChange, name }) => {
  
  const [arrayof, setArray] = useState([]);
  const [control, setControl] = useState();

  const shape = like
    ? "absolute top-[60%] left-43 md:left-65 w-[18px] h-[24px] transition group-focus-within:rotate-90"
    : "absolute top-[60%] right-4 w-[18px] h-[24px] transition group-focus-within:rotate-90";

  useEffect(() => {
    setControl(name);
    const token = localStorage.getItem('token');

    axios.get(`https://backndVoo.voo-hub.com/api/admin/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        if (name === "country") return setArray(response.data.countries);
        if (name === "city") return setArray(response.data.cities);
        if (name === "zone") return setArray(response.data[0].zones);
        if (name === "organization") return setArray(response.data.orgnization);
     
      })
      .catch((error) => {
      
        console.log(error);
      });
  }, [name]);  

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
        className="w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10"
      >
        <option  value="null">{placeholder}</option>
        {arrayof && arrayof.length > 0 && arrayof.map((item) => {
          if (control === "country") {
            return (
              <option  key={item.id} value={item.id}>
              {item.name}
            </option>
            );
            }  else if (control === "city") {
            return (
              <option  key={item.id} value={item.id}>
              {item.name}
            </option>
            );
            }  else if (control === "zone") {
            return (
              <option  key={item.id} value={item.id}>
              {item.name}
            </option>
            );
            }  else if (control === "organization") {
            return (
              <option  key={item.id} value={item.id}>
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

export default InputArrow;
