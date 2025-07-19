import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-600">
          Edusmart Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-blue-600">🏠 Dashboard</Link>
          <Link to="/admin/manage-users" className="block px-4 py-2 rounded hover:bg-blue-600">👤 Kelola Pengguna</Link>
          <Link to="/admin/manage-categories" className="block px-4 py-2 rounded hover:bg-blue-600">❓ Kelola BAB/Materi</Link>
          <Link to="/admin/leaderboard" className="block px-4 py-2 rounded hover:bg-blue-600">🏆 Leaderboard</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
