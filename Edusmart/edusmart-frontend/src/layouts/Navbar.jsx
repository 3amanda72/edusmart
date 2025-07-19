import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaChalkboardTeacher className="text-blue-600 text-xl" />
          <span className="text-xl font-bold text-blue-700">EduSmart</span>
          <span className="hidden md:inline text-sm text-gray-500 ml-2">| Panel Siswa</span>
        </div>

        {isLoggedIn ? (
          <>
            {/* MENU SAAT LOGIN */}
            <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <Link to="/materials" className="hover:text-blue-600">Materi</Link>
              <Link to="/quiz-list" className="hover:text-blue-600">Kuis</Link>
              <Link to="/badges" className="hover:text-blue-600">Lencana</Link>
              <Link to="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600">
                <FaUserCircle className="text-xl" />
                <span className="hidden md:block">Profil</span>
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* MENU SAAT BELUM LOGIN */}
            <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
              <Link to="/" className={`hover:text-blue-600 ${location.pathname === "/" ? "text-blue-700 font-semibold" : ""}`}>
                Beranda
              </Link>
            </div>
            <div>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
