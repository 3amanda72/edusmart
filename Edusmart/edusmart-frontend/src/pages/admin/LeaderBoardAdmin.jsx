import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const LeaderboardAdmin = () => {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/leaderboard${category ? `?category=${category}` : ""}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Gagal mengambil leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [category]);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">📊 Leaderboard Siswa (Admin View)</h1>

        {/* Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Filter Berdasarkan BAB:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-72 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Nama Siswa</th>
                <th className="px-4 py-2 border">Total Skor</th>
                <th className="px-4 py-2 border">Rata-rata</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Memuat data leaderboard...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Tidak ada data untuk kategori ini.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-purple-50 transition duration-200 ${
                      idx < 3 ? "bg-yellow-50 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border">{getMedal(idx)}</td>
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border">{item.totalScore}</td>
                    <td className="px-4 py-2 border">{item.avgScore.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default LeaderboardAdmin;
