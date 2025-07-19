// src/pages/SelectMaterialForQuiz.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SelectMaterialForQuiz = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllMaterials = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/materials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaterials(res.data?.data || []);
      } catch (err) {
        console.error("❌ Gagal mengambil materi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMaterials();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📚 Pilih Materi untuk Kelola Kuis
      </h1>

      {loading ? (
        <p className="text-gray-500">⏳ Memuat daftar materi...</p>
      ) : materials.length === 0 ? (
        <p className="text-red-600">⚠️ Tidak ada materi tersedia.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {materials.map((mat) => (
            <div
              key={mat._id}
              className="bg-white shadow-md border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{mat.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                Kategori: {mat.category?.name || "-"}
              </p>
              <Link
                to={`/manage-quiz/${mat._id}`}
                className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Kelola Kuis
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectMaterialForQuiz;
