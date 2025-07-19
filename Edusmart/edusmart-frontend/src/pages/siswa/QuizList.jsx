import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const QuizList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndMaterials = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login ulang.");
          return;
        }

        // Ambil daftar kategori
        const catRes = await axios.get("http://localhost:5000/api/categories");
        const responseData = catRes.data?.data ?? catRes.data;
        const categoryList = Array.isArray(responseData) ? responseData : [];

        // Ambil materi untuk setiap kategori
        const allCategories = await Promise.all(
          categoryList.map(async (cat) => {
            try {
              const materiRes = await axios.get(
                `http://localhost:5000/api/materials/by-category/${cat._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const materials = Array.isArray(materiRes.data?.data)
                ? materiRes.data.data
                : [];

              return { ...cat, materials };
            } catch (err) {
              console.error(`❌ Gagal mengambil materi untuk ${cat.name}`, err);
              return { ...cat, materials: [] };
            }
          })
        );

        setCategories(allCategories);
      } catch (err) {
        console.error("❌ Gagal mengambil kategori:", err);
        setError("Terjadi kesalahan saat mengambil kategori.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndMaterials();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4 bg-blue-100 rounded-full p-3">
              <div className="bg-blue-600 text-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3">
              Jelajahi Kuis Interaktif
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Tingkatkan pemahamanmu dengan mengerjakan kuis berdasarkan materi pembelajaran
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Memuat data kuis...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Silakan coba lagi atau hubungi administrator.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada kategori</h3>
              <p className="mt-1 text-gray-500">Belum ada kategori kuis yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-white">BAB {cat.name}</h2>
                        <p className="mt-1 text-blue-100">
                          {cat.materials.length} materi tersedia
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Materials List */}
                  <div className="p-8">
                    {cat.materials.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada materi</h3>
                        <p className="mt-1 text-sm text-gray-500">Materi untuk kategori ini sedang dalam pengembangan.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cat.materials.map((mat) => (
                          <div
                            key={mat._id}
                            className="group relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-300 transition-all duration-300"
                          >
                            <div className="p-6">
                              <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {cat.name}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{mat.title}</h3>
                              <p className="text-gray-500 text-sm mb-6">Uji pemahamanmu tentang materi ini</p>
                              <div className="absolute bottom-6 left-6 right-6">
                                <Link
                                  to={`/quiz?materiId=${mat._id}`}
                                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 group-hover:bg-blue-700"
                                >
                                  Mulai Kuis
                                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

export default QuizList;