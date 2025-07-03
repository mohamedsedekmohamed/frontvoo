import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import Home from "../pages/admin/Home";
import City from "../pages/admin/City";
import Country from "../pages/admin/Country";
import Events from "../pages/admin/Events";
import Pendingusers from "../pages/admin/Pendingusers";
import User from "../pages/admin/User";
import Tasks from "../pages/admin/Tasks";
import Zone from "../pages/admin/Zone";
import Organizeation from "../pages/admin/Organizeation";
import Settings from "../pages/admin/Settings";
import Information from "../pages/admin/Information";
// import Information from "../pages/admin/Information";
import Userdetails from "../pages/admin/Userdetails";
import EventDetalis from "../pages/admin/EventDetalis";
import Organizeationdatali from "../pages/admin/Organizeationdatali";
import TasksDetails from "../pages/admin/TasksDetails";
import Operation from "../pages/admin/Operation";
import OperationTasks from "../pages/admin/OperationTasks";
import Requests from "../pages/admin/Requests";
import Requestsdetails from "../pages/admin/Requestsdetails";
import PendingusersDetaklis from "../pages/admin/PendingusersDetaklis";

//add
import AddUser from "../addandedit/AddUser";
import Addorganizeation from "../addandedit/Addorganizeation";
import AddEvents from "../addandedit/AddEvents";
import Addtasks from "../addandedit/Addtasks";
import Addcountry from "../addandedit/Addcountry";
import Addcity from "../addandedit/Addcity";
import Addzone from "../addandedit/Addzone";
import Putprofile from "../addandedit/Putprofile";
//
import AddFeeds from "../addandedit/AddFeeds";
import Feeds from "../pages/admin/Feeds";
//
import Policies from "../pages/admin/Policies"
import AddPolicies from '../addandedit/AddPolicies'
//
import Notification from '../pages/admin/Notification'
import AddNotification from '../addandedit/AddNotification'
import AddInformation from "../pages/admin/AddInformation"
//
 import Newnotification from "../pages/admin/Newnotification";
const AppRoutes = ({ setIsLoggedIn }) => {
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
        <Route path="operation" element={<Operation />} />
        <Route path="operationTasks" element={<OperationTasks />} />
        <Route path="pendingusers" element={<Pendingusers />} />
        <Route path="pendingusersDetaklis" element={<PendingusersDetaklis />} />
        {/* add */}
        <Route path="addUser" element={<AddUser />} />
        <Route path="addorganizeation" element={<Addorganizeation />} />
        <Route path="addEvents" element={<AddEvents />} />
        <Route path="addtasks" element={<Addtasks />} />
        <Route path="addcountry" element={<Addcountry />} />
        <Route path="addcity" element={<Addcity />} />
        <Route path="addzone" element={<Addzone />} />
        <Route path="putprofile" element={<Putprofile />} />
        <Route
          path="information"
          element={<Information setIsLoggedIn={setIsLoggedIn} />}
        />
        {/*  */}
        <Route path="feeds" element={<Feeds />} />
        <Route path="addfeeds" element={<AddFeeds />} />
        {/*  */}
        <Route path="policies" element={<Policies />} />
        <Route path="addpolicies" element={<AddPolicies />} />
        {/*  */}
        <Route path="notification" element={<Notification />} />
        <Route path="addotification" element={<AddNotification />} />
        {/*  */}
               <Route path="AddInformation" element={<AddInformation />} />
{/*  */}
<Route path="newnotification" element={<Newnotification />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
