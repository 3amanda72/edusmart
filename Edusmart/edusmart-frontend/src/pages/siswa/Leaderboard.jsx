import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(userRes.data.name);

        const leaderboardRes = await axios.get(
          `http://localhost:5000/api/leaderboard${category ? `?category=${category}` : ""}`
        );
        setData(leaderboardRes.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data leaderboard:", err);
      }
    };

    fetchData();
  }, [category]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10">
        <div className="max-w-7xl mx-auto bg-white p-8 md:px-14 lg:px-20 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2">🏆 Leaderboard Siswa</h1>
          <p className="text-gray-600 mb-10">Lihat peringkat dan capaian terbaik siswa berdasarkan total skor dan rata-rata skor kuis.</p>

          {/* Filter kategori */}
          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">Filter Berdasarkan BAB:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">🌐 Semua Kategori</option>
              <option value="Aljabar">🔢 Aljabar</option>
              <option value="Perbandingan">⚖️ Perbandingan</option>
              <option value="Aritmatika Sosial">💰 Aritmatika Sosial</option>
              <option value="Garis dan Sudut">📐 Garis dan Sudut</option>
              <option value="Segiempat dan Segitiga">📏 Segiempat & Segitiga</option>
              <option value="Penyajian Data">📊 Penyajian Data</option>
            </select>
          </div>

          {/* Tabel leaderboard */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
              <thead className="bg-blue-100 text-blue-800 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 border">#</th>
                  <th className="px-4 py-3 border">Nama</th>
                  <th className="px-4 py-3 border">Total Skor</th>
                  <th className="px-4 py-3 border">Rata-rata Skor</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 font-medium">
                      Tidak ada data tersedia.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => {
                    const isCurrentUser = item.name === userName;
                    const isTop1 = idx === 0;

                    const rowClass = isTop1
                      ? "bg-yellow-100 font-bold"
                      : isCurrentUser
                      ? "bg-blue-100 text-blue-900 font-semibold"
                      : "hover:bg-blue-50 transition";

                    return (
                      <tr key={idx} className={rowClass}>
                        <td className="px-4 py-2 border">{idx + 1}</td>
                        <td className="px-4 py-2 border flex items-center gap-2">
                          {isTop1 && "👑"} {item.name}
                          {isCurrentUser && (
                            <span className="ml-1 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Saya</span>
                          )}
                        </td>
                        <td className="px-4 py-2 border">{item.totalScore.toLocaleString()}</td>
                        <td className="px-4 py-2 border">{item.avgScore?.toFixed(2) || "0.00"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Leaderboard;
