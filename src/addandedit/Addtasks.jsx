import React from 'react'
import AddAll from '../ui/AddAll'
import InputField from '../ui/InputField'

const Addtasks = () => {
  return (
    <div>
<AddAll name="Add tasks" navGo={-1}/>
<div className="flex flex-wrap gap-6 mt-6">
    <InputField/>

</div>
    </div>
  )
}
export default Addtasks
