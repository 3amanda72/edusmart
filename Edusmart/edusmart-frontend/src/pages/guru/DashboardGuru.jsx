// File: DashboardGuru.jsx
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  FaGraduationCap,
  FaSignOutAlt,
  FaBook,
  FaChartLine,
  FaUserTie,
  FaChalkboardTeacher
} from "react-icons/fa";
import { MdQuiz, MdCategory, MdMenuBook } from "react-icons/md";

const SimpleNavbar = ({ onLogout, user }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <FaChalkboardTeacher className="text-blue-600 text-xl" />
            <span className="text-xl font-bold text-blue-700">EduSmart</span>
            <span className="hidden md:inline text-sm text-gray-500 ml-2">| Panel Guru</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <FaUserTie className="mr-2 text-blue-500" />
              <span>Halo, {user?.name || "Guru"}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              <FaSignOutAlt className="mr-2" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const DashboardGuru = () => {
  const [stats, setStats] = React.useState({
    quizCount: 0,
    materialCount: 0,
    categoryCount: 0,
  });

  React.useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const [quizRes, materialRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:5000/api/quizzes/total", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/materials/total", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/categories/total", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        quizCount: quizRes.data.total || 0,
        materialCount: materialRes.data.total || 0,
        categoryCount: categoryRes.data.total || 0
      });
    } catch (err) {
      console.error("❌ Gagal mengambil statistik:", err);
    }
  };

  fetchStats();
}, []);


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const user = {
    name: "Bapak/Ibu Guru",
    role: "Pengajar",
  };

  return (
    <>
      <SimpleNavbar onLogout={handleLogout} user={user} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaGraduationCap className="text-blue-600" />
              Dashboard Guru
            </h1>
            <p className="text-gray-600 mt-1">Kelola konten pembelajaran dan aktivitas siswa</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                {
                  icon: <MdQuiz className="text-xl" />,
                  label: "Total Kuis",
                  count: stats.quizCount,
                  bg: "bg-blue-100 text-blue-600",
                },
                {
                  icon: <MdMenuBook className="text-xl" />,
                  label: "Total Materi",
                  count: stats.materialCount,
                  bg: "bg-green-100 text-green-600",
                },
                {
                  icon: <MdCategory className="text-xl" />,
                  label: "Total BAB",
                  count: stats.categoryCount,
                  bg: "bg-purple-100 text-purple-600",
                },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${stat.bg}`}>{stat.icon}</div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Kelola Kuis",
                to: "/manage-quiz",
                desc: "Buat dan kelola kuis untuk siswa, serta pantau hasilnya.",
                icon: <FaBook className="text-xl" />,
                color: "text-blue-600 bg-blue-100",
                hover: "hover:border-blue-200",
                textColor: "text-blue-600",
              },
              {
                title: "Kelola BAB/Kategori",
                to: "/manage-categories",
                desc: "Atur struktur pembelajaran dan susun urutan materi.",
                icon: <FaChartLine className="text-xl" />,
                color: "text-green-600 bg-green-100",
                hover: "hover:border-green-200",
                textColor: "text-green-600",
              },
              {
                title: "Kelola Materi",
                to: "/manage-materials",
                desc: "Tambahkan dan update materi pembelajaran dengan mudah.",
                icon: <FaBook className="text-xl" />,
                color: "text-yellow-600 bg-yellow-100",
                hover: "hover:border-yellow-200",
                textColor: "text-yellow-600",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ${item.hover} transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 ${item.color}`}>{item.icon}</div>
                    <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                  <div className={`mt-4 flex items-center group-hover:${item.textColor} transition-colors`}>
                    <span className="text-sm font-medium">Akses sekarang</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Aktivitas Terkini
            </h2>
            <div className="space-y-4">
              {[
                {
                  iconBg: "bg-blue-100 text-blue-600",
                  title: "Anda menambahkan kuis baru",
                  time: "Hari ini, 10:30 WIB",
                  iconPath: (
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  ),
                },
                {
                  iconBg: "bg-green-100 text-green-600",
                  title: 'Materi "Aljabar Dasar" diperbarui',
                  time: "Kemarin, 15:45 WIB",
                  iconPath: (
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  ),
                },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`flex-shrink-0 p-2 rounded-lg mr-3 ${activity.iconBg}`}>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      {activity.iconPath}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardGuru;
