import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaBookOpen, FaClipboardList } from "react-icons/fa";

const CategoryDetails = () => {
  const { category } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/materials/categories/${category}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ Gunakan fallback array agar tidak error
        const dataArray = res.data.data || res.data || [];

        const materialsWithQuizzes = await Promise.all(
          dataArray.map(async (material) => {
            const quizRes = await axios.get(
              `http://localhost:5000/api/quizzes/materi/${material._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...material, quizCount: quizRes.data.length };
          })
        );

        setMaterials(materialsWithQuizzes);
      } catch (err) {
        console.error("❌ Gagal mengambil materi atau kuis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Daftar Materi dalam BAB
        </h2>

        {loading ? (
          <p className="text-gray-600">Memuat materi dan kuis...</p>
        ) : materials.length === 0 ? (
          <p className="text-gray-600">Tidak ada materi dalam BAB ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {materials.map((mat) => (
              <div
                key={mat._id}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <FaBookOpen className="text-blue-600" />
                  {mat.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Kuis tersedia: <span className="font-medium text-green-700">{mat.quizCount}</span>
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/materials/${category}/materi/${mat._id}`}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-800 transition text-sm"
                  >
                    Buka Materi
                  </Link>

                  {mat.quizCount > 0 && (
                    <Link
                      to={`/materials/${category}/quiz?materiId=${mat._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Kerjakan Kuis
                    </Link>
                  )}

                  <Link
                    to={`/materials/${category}/quiz/history?materiId=${mat._id}`}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition text-sm"
                  >
                    <FaClipboardList className="inline mr-1" />
                    Riwayat Kuis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
