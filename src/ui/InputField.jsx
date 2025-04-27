import React from 'react'

const InputField = ({placeholder,value, onChange,name  ,email,disabled}) => {
  return (
    <div className='flex flex-col gap-3 items-start justify-center'>
      <span className='font-bold  text-one'>{placeholder}</span>
<input type={email} className={`  w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10`} disabled={disabled}     name={name}  
value={value} onChange={onChange}  placeholder={placeholder}/>

    </div>
  )
}

export default InputField
