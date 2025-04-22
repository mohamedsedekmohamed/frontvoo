import React from 'react'
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen gap-3 mx-2 mt-2 relative">
    <aside className="w-64 bg-gradient-to-b from-one to-two  sticky top-0 h-screen 0">
      <AdminSidebar />
    </aside>

    <div className="flex-1 flex flex-col gap-2">
      <header className="bg- bg-three rounded-[12px] shadow p-4">
        <AdminNavbar />
      </header>

      <main className="flex-1  p-4">
        <Outlet />
      </main>
    </div>
  </div>
  )
}

export default AdminLayout
