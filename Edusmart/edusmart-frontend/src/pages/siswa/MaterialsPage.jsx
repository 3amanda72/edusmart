// src/pages/siswa/MaterialsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaChevronRight, FaLock } from "react-icons/fa";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import Swal from "sweetalert2";

const MaterialsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockedCategories, setUnlockedCategories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil kategori dan progres
        const [categoriesRes, progressRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios
            .get("http://localhost:5000/api/user-progress/categories", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: { data: [] } })),
        ]);

        const categoriesData = categoriesRes.data?.data || [];
        setCategories(categoriesData);

        // Hitung BAB terakhir yang sudah dibuka
        const progressData = progressRes.data?.data || [];

        let maxIndex = 0;
        if (progressData.length > 0) {
          for (let i = 0; i < categoriesData.length; i++) {
            const currentCat = categoriesData[i];
            const unlocked = progressData.find(
              (p) => p.categoryId === currentCat._id && p.isUnlocked
            );
            if (unlocked) maxIndex = i + 1; // BAB selanjutnya bisa dibuka
          }
        }

        const unlocked = categoriesData
          .slice(0, maxIndex + 1)
          .map((cat) => cat._id);
        setUnlockedCategories(unlocked);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        Swal.fire("Error", "Gagal memuat data pembelajaran", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const illustrations = [
    "https://img.freepik.com/free-vector/hand-drawn-stem-education-background_23-2149430423.jpg",
    "https://img.freepik.com/free-vector/gradient-stem-education-background_23-2149248712.jpg",
    "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148479685.jpg",
    "https://img.freepik.com/free-vector/gradient-science-background_23-2148873681.jpg",
  ];

  const getRandomIllustration = () =>
    illustrations[Math.floor(Math.random() * illustrations.length)];

  const handleLockedClick = (categoryName) => {
    Swal.fire({
      icon: "info",
      title: "Materi Masih Terkunci",
      html: `<p>Anda perlu menyelesaikan materi sebelumnya untuk membuka <strong>${categoryName}</strong>.</p>`,
      confirmButtonText: "Oke, mengerti",
    });
  };

  const handleCategoryClick = (categoryId, isLocked, categoryName) => {
    if (isLocked) {
      handleLockedClick(categoryName);
    } else {
      navigate(`/materials/${categoryId}`);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Pilih BAB Pembelajaran
            </h2>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                <img
                  src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg"
                  alt="Tidak ada data"
                  className="w-full max-w-xs mx-auto mb-6"
                />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Belum ada BAB tersedia
                </h3>
                <p className="text-gray-500 mb-4">
                  Kami sedang menyiapkan materi terbaik untukmu
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, index) => {
                  const isLocked = !unlockedCategories.includes(cat._id);
                  const illustration = getRandomIllustration();

                  return (
                    <div
                      key={cat._id}
                      className={`group bg-white rounded-xl shadow-md transition-all overflow-hidden border 
                        ${
                          isLocked
                            ? "border-gray-200 cursor-not-allowed opacity-75"
                            : "hover:shadow-xl hover:border-blue-200 cursor-pointer"
                        }`}
                      onClick={() =>
                        handleCategoryClick(cat._id, isLocked, cat.name)
                      }
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={illustration}
                          alt={`Ilustrasi ${cat.name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            BAB {index + 1}
                          </span>
                        </div>
                        {isLocked && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <FaLock /> Terkunci
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-lg flex-shrink-0 ${
                              isLocked
                                ? "bg-gray-100 text-gray-400"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <FaBookOpen className="text-lg" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {cat.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {isLocked
                                ? "Selesaikan BAB sebelumnya untuk membuka"
                                : "Mulai belajar dan kuasai materi ini"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            5 Materi • 3 Kuis
                          </span>
                          {!isLocked ? (
                            <span className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                              Pelajari <FaChevronRight className="ml-1 text-xs" />
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 flex items-center">
                              Terkunci
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MaterialsPage;
