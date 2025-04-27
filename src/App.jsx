import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import AppOrganiztionLayout from "./routes/AppOrganiztionLayout.jsx";
import Login from "./Auth/Login.jsx";

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
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setorganiztionLayout={setorganiztionLayout} />} />
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
  );
}

export default App;
