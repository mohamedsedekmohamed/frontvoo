import React, { useEffect } from 'react'
import { Routes, Route,Navigate} from "react-router-dom";
// import Home from '../pages/Organiztion/HomeOr';
import User from '../pages/Organiztion/UserOr';
import AddInformationor from '../pages/Organiztion/AddInformationor';
import Events from '../pages/Organiztion/EventsOr';
import OperationTasksOr from '../pages/Organiztion/OperationTasksOr';
import Requests from '../pages/Organiztion/RequestsOr';
import Tasks from '../pages/Organiztion/TasksOr';
import OperationOr from '../pages/Organiztion/OperationOr';
import UserDetails from '../pages/Organiztion/UserDetails';
import PendingusersDetaklis from '../pages/Organiztion/PendingusersDetaklis';
// import Operation from '../pages/admin/Operation';
import Eventsdetails from '../pages/Organiztion/Eventsdetails';
import Tasksdetails from '../pages/Organiztion/Tasksdetails';
import InformationOr from '../pages/Organiztion/InformationOr';
import Pendingusers from '../pages/Organiztion/Pendingusers';
// import Organization from '../pages/Organiztion/OrganizeationOr';
import OrganiztionLayout from "../Layouts/OrganiztionLayout";
import AdduserOr from '../Addorganiztion/AdduserOr';
import Addeventsor from '../Addorganiztion/Addeventsor';
import Addtasksor from '../Addorganiztion/Addtasksor';
// import Addorganization from '../Addorganiztion/Addorganization';
import { useTranslation } from 'react-i18next';
import '../translation/i18n'; 
import Home from '../pages/Organiztion/HomeOr'
import AddProjector from '../Addorganiztion/AddProjector'
import ProjectOr from '../pages/Organiztion/ProjectOr'
import AddFeedsor from '../Addorganiztion/AddFeedsor'
import Feedsor from '../pages/Organiztion/Feedsor'
import Newnotificationor from '../pages/Organiztion/Newnotificationor';
const AppOrganiztionLayout = ({setorganiztionLayout,setIsLoggedIn}) => {
  // App.jsx
     const {  i18n } = useTranslation();
useEffect(() => {
  const storedLang = localStorage.getItem('language');
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
  const langToUse = storedLang || browserLang;

  if (i18n.language !== langToUse) {
    i18n.changeLanguage(langToUse);
  }

  if (!storedLang) {
    localStorage.setItem('language', langToUse);
  }
}, []);

  return (
    <Routes>

    <Route path="/" element={<Navigate to="/organizeation/user" />} />
    <Route path="*" element={<Navigate to="/organizeation/user" replace />} />
       <Route path="/organizeation" element={<OrganiztionLayout />}>
       <Route path="user" element={<User />} />
       <Route path="events" element={<Events />} />
       <Route path="pendingusers" element={<Pendingusers />} />
       <Route path="pendingusersDetaklis" element={<PendingusersDetaklis />} />
       <Route path="requests" element={<Requests />} />
       <Route path="tasks" element={<Tasks />} />
       <Route path="addInformationor" element={<AddInformationor />} />
       <Route path="userDetails" element={<UserDetails />} />
       <Route path="operationTasksOr" element={<OperationTasksOr />} />
       <Route path="eventsdetails" element={<Eventsdetails />} />
       <Route path="operationOr" element={<OperationOr />} />
       <Route path="Home" element={<Home />} />
       {/* <Route path="operation" element={<Operation />} /> */}
      
       <Route path="tasksdetails" element={<Tasksdetails />} />
       <Route path="informationOr" element={<InformationOr setorganiztionLayout={setorganiztionLayout}  setIsLoggedIn={setIsLoggedIn}/>} />
       {/*  */}
       <Route path="adduser" element={<AdduserOr />} />
       <Route path="addeventsor" element={<Addeventsor />} />
       <Route path="addtasksor" element={<Addtasksor />} />
       {/* datalis */}
       <Route path="projectOr" element={<ProjectOr />} />
       <Route path="addProjector" element={<AddProjector />} />
       <Route path="Feedsor" element={<Feedsor />} />
       <Route path="AddFeedsor" element={<AddFeedsor />} />
       {/*  */}
       <Route path="newnotificationor" element={<Newnotificationor />} />
    </Route>
    
      </Routes>
  )
}

export default AppOrganiztionLayout
