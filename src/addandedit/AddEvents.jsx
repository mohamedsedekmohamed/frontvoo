import React from 'react'
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'

const AddEvents = () => {
  return (
    <div>
<AddAll name="Add Events" navGo={-1}/>
<div className="flex flex-wrap gap-6 mt-6">
    <InputField/>
    <InputField/>
    <InputField/>
    <InputField/>
</div>
    </div>
  )
}

export default AddEvents
