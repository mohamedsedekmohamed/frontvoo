import React from 'react'
const InputField = ({placeholder,value, onChange,name  ,email,disabled}) => {
   const inputType = email || 'text';

  // تحديد أقصى عدد حروف بناءً على نوع الإدخال
  const maxLength =
    email === 'number' ? 20 :
    email === 'email' ? 50 :
    50;

   
  
  return (
    <div className='flex flex-col gap-3 items-start justify-center'>
      <span className='font-bold  text-one'>{placeholder}</span>
<input type={inputType} className={`  w-[200px] md:w-[300px] h-[48px] md:h-[72px] border-1 border-two rounded-[8px] placeholder-seven pl-10`} disabled={disabled}     name={name}  
value={value} onChange={onChange}          maxLength={maxLength}
 placeholder={placeholder}/>

    </div>
  )
}

export default InputField
