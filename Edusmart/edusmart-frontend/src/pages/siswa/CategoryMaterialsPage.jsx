// src/pages/materials/CategoryMaterialsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import { FaBookOpen, FaHistory, FaPlayCircle } from "react-icons/fa";

const CategoryMaterialsPage = () => {
  const { categoryId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/materials/by-category/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data || [];
        setMaterials(data);

        if (data.length > 0 && data[0].category?.name) {
          setCategoryName(data[0].category.name);
        }
      } catch (err) {
        console.error("❌ Gagal mengambil materi:", err);
      }
    };

    fetchMaterials();
  }, [categoryId]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center">
            📘 Materi Kategori: {categoryName || "Memuat..."}
          </h1>

          {materials.length === 0 ? (
            <p className="text-gray-500 text-center">
              Belum ada materi tersedia untuk kategori ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-blue-700">
                      {material.title}
                    </h2>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mt-2 inline-block">
                      Tipe: {material.type?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <Link
                      to={`/materials/${categoryId}/materi/${material._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FaBookOpen /> Lihat Materi
                    </Link>

                    <Link
                      to={`/materials/${categoryId}/quiz?materiId=${material._id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FaPlayCircle /> Kerjakan Kuis
                    </Link>

                    <Link
                      to="/q-history"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FaHistory /> Riwayat Kuis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CategoryMaterialsPage;
