import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppOrganiztionLayout from "./routes/AppOrganiztionLayout.jsx";
import Login from "./Auth/Login.jsx";
import Suppert from "./Auth/Suppert.jsx";
import Privacy from "./Auth/Privacy.jsx";
import Home from './Landpage/Home.jsx'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = sessionStorage.getItem('isLoggedIn');
    return stored === 'true';
  });

  const [organiztionLayout, setorganiztionLayout] = useState(() => {
    const stored = sessionStorage.getItem('organiztionLayout');
    return stored === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
    sessionStorage.setItem('organiztionLayout', organiztionLayout ? 'true' : 'false');
  }, [isLoggedIn, organiztionLayout]);

  return (
    <div className="poppins-medium">

    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Home />}  />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setorganiztionLayout={setorganiztionLayout} />} />
            <Route path="/support" element={<Suppert />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {organiztionLayout ? (
              <Route path="/*" element={<AppOrganiztionLayout setorganiztionLayout={setorganiztionLayout} setIsLoggedIn={setIsLoggedIn} />} />
            ) : (
              <Route path="/*" element={<AppRoutes setIsLoggedIn={setIsLoggedIn} />} />
            )}
          </>
        )}
      </Routes>
    </BrowserRouter>
  
        </div>
  );
}

export default App;
