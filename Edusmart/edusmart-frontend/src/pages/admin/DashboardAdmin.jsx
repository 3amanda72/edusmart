import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";

const DashboardAdmin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [topUserName, setTopUserName] = useState("-");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchStats = async () => {
      try {
        const [usersRes, categoriesRes, leaderboardRes, meRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/total", config),
          axios.get("http://localhost:5000/api/categories/total", config),
          axios.get("http://localhost:5000/api/leaderboard", config),
          axios.get("http://localhost:5000/api/users/me", config),
        ]);

        setTotalUsers(usersRes.data.total || 0);
        setTotalCategories(categoriesRes.data.total || 0);
        setAdminName(meRes.data.name || "Admin");

        const leaderboard = leaderboardRes.data;
        console.log("🧾 Data user login:", meRes.data);

        if (Array.isArray(leaderboard) && leaderboard.length > 0) {
          setTopUserName(leaderboard[0].name || "-");
        }
      } catch (err) {
        console.error("❌ Gagal mengambil statistik dashboard:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Dashboard Admin</h1>
      <p className="text-gray-700">
        Selamat datang, <strong>{adminName}</strong>! Kamu dapat mengelola data pengguna, soal kuis, leaderboard siswa, dan lainnya dari panel ini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">👤 Total Pengguna</h2>
          <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">📚 Total BAB</h2>
          <p className="text-2xl font-bold text-blue-600">{totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">🏆 Pemuncak Leaderboard</h2>
          <p className="text-xl font-bold text-green-700">{topUserName}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
