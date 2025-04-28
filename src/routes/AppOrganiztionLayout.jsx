import React from 'react'
import { Routes, Route,Navigate} from "react-router-dom";
// import Home from '../pages/Organiztion/HomeOr';
import User from '../pages/Organiztion/UserOr';
import AddInformationor from '../pages/Organiztion/AddInformationor';
import Events from '../pages/Organiztion/EventsOr';
import Requests from '../pages/Organiztion/RequestsOr';
import Tasks from '../pages/Organiztion/TasksOr';
import UserDetails from '../pages/Organiztion/UserDetails';
import Eventsdetails from '../pages/Organiztion/Eventsdetails';
import Tasksdetails from '../pages/Organiztion/Tasksdetails';
import InformationOr from '../pages/Organiztion/InformationOr';
// import Organization from '../pages/Organiztion/OrganizeationOr';
import OrganiztionLayout from "../Layouts/OrganiztionLayout";
import AdduserOr from '../Addorganiztion/AdduserOr';
import Addeventsor from '../Addorganiztion/Addeventsor';
import Addtasksor from '../Addorganiztion/Addtasksor';
// import Addorganization from '../Addorganiztion/Addorganization';

const AppOrganiztionLayout = ({setorganiztionLayout,setIsLoggedIn}) => {
  return (
    <Routes>

    <Route path="/" element={<Navigate to="/organizeation/user" />} />
    <Route path="*" element={<Navigate to="/organizeation/user" replace />} />
       <Route path="/organizeation" element={<OrganiztionLayout />}>
       <Route path="user" element={<User />} />
       <Route path="events" element={<Events />} />
       <Route path="requests" element={<Requests />} />
       <Route path="tasks" element={<Tasks />} />
       <Route path="addInformationor" element={<AddInformationor />} />
       <Route path="userDetails" element={<UserDetails />} />
       <Route path="eventsdetails" element={<Eventsdetails />} />
       <Route path="tasksdetails" element={<Tasksdetails />} />
       <Route path="informationOr" element={<InformationOr setorganiztionLayout={setorganiztionLayout}  setIsLoggedIn={setIsLoggedIn}/>} />
       {/*  */}
       <Route path="adduser" element={<AdduserOr />} />
       <Route path="addeventsor" element={<Addeventsor />} />
       <Route path="addtasksor" element={<Addtasksor />} />
       {/* datalis */}
    </Route>
    
      </Routes>
  )
}

export default AppOrganiztionLayout
