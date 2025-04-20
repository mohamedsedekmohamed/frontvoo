import React from 'react'
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'

const AddUser = () => {
  return (
    <div>
<AddAll name="Add users" navGo={-1}/>
<div className="flex flex-wrap gap-6 mt-6">
    <InputField/>
    <InputField/>
    <InputField/>
    <InputField/>
</div>
    </div>
  )
}

export default AddUser
