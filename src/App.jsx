import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useEffect, useState } from "react";
import Login from "./Auth/Login.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = sessionStorage.getItem('isLoggedIn');
    return stored === 'true'; // نحولها من string لـ boolean
  });
useEffect(() => {

  if(isLoggedIn){
    sessionStorage.setItem('isLoggedIn', 'true');
    }}, [isLoggedIn]);

  return (
    <>
     <BrowserRouter>
      {isLoggedIn ? (
        <AppRoutes />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </BrowserRouter>
    </>
  )
}

export default App
