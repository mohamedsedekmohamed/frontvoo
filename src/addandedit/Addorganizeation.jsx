import React from 'react'
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'

const Addorganizeation = () => {
  return (
    <div>
    <AddAll name="Add organizeations " navGo={-1}/>
    <div className="flex flex-wrap gap-6 mt-6">
        <InputField/>
     
    </div>
        </div>
    
  )
}

export default Addorganizeation
