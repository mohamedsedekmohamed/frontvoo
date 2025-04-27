import React from 'react'
import { Routes, Route,Navigate} from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import Home from "../pages/admin/Home";
import City from "../pages/admin/City";
import Country from "../pages/admin/Country";
import Events from "../pages/admin/Events";
import User from "../pages/admin/User";
import Tasks from "../pages/admin/Tasks";
import Zone from "../pages/admin/Zone";
import Organizeation from "../pages/admin/Organizeation";
import Settings from "../pages/admin/Settings";
import Information from '../pages/admin/Information'
// import Information from "../pages/admin/Information";
import Userdetails from "../pages/admin/Userdetails";
import EventDetalis from "../pages/admin/EventDetalis";
import Organizeationdatali from "../pages/admin/Organizeationdatali";
import TasksDetails from "../pages/admin/TasksDetails";
import Requests from "../pages/admin/Requests";
import Requestsdetails from "../pages/admin/Requestsdetails";
//add
import AddUser from "../addandedit/AddUser";
import Addorganizeation from "../addandedit/Addorganizeation";
import AddEvents from "../addandedit/AddEvents";
import Addtasks from "../addandedit/Addtasks";
import Addcountry from "../addandedit/Addcountry";
import Addcity from "../addandedit/Addcity";
import Addzone from "../addandedit/Addzone";
import Putprofile from "../addandedit/Putprofile";

const AppRoutes = ({setIsLoggedIn}) => {
  return (
    <Routes>

<Route path="/" element={<Navigate to="/admin/home" />} />
<Route path="*" element={<Navigate to="/admin/home" replace />} />
   <Route path="/admin" element={<AdminLayout />}>
  <Route path="home" element={<Home />} />
  <Route path="city" element={<City />} />
  <Route path="country" element={<Country />} />
  <Route path="events" element={<Events />} />
  <Route path="user" element={<User />} />
  <Route path="tasks" element={<Tasks />} />
  <Route path="zone" element={<Zone />} />
  <Route path="organizeation" element={<Organizeation />} />
  <Route path="settings" element={<Settings />} />
  <Route path="userdetails" element={<Userdetails />} />
  <Route path="eventDetalis" element={<EventDetalis />} />
  <Route path="organizeationdatali" element={<Organizeationdatali />} />
  <Route path="tasksDetails" element={<TasksDetails />} />
  <Route path="requests" element={<Requests />} />
  <Route path="requestsdetails" element={<Requestsdetails />} />
  {/* add */}
  <Route path="addUser" element={<AddUser />} />
  <Route path="addorganizeation" element={<Addorganizeation />} />
  <Route path="addEvents" element={<AddEvents />} />
  <Route path="addtasks" element={<Addtasks />} />
  <Route path="addcountry" element={<Addcountry />} />
  <Route path="addcity" element={<Addcity />} />
  <Route path="addzone" element={<Addzone />} />
  <Route path="putprofile" element={<Putprofile />} />
  <Route path="information" element={<Information setIsLoggedIn={setIsLoggedIn} />} />

</Route>

  </Routes>
  )
}

export default AppRoutes
