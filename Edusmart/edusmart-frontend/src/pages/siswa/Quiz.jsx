import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const Quiz = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const materiId = queryParams.get("materiId");

  // Define the correct order of materials
  const orderedCategories = [
    "Perbandingan",
    "Segitiga dan Segiempat",
    "Aritmatika Sosial",
    "Penyajian Data",
    "Garis dan Sudut"
  ];

  const [material, setMaterial] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedMaterials, setRecommendedMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [scoreRatio, setScoreRatio] = useState(0);

  // Warna berdasarkan kategori
  const categoryColors = {
    "Perbandingan": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    "Segitiga dan Segiempat": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
    "Aritmatika Sosial": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    "Penyajian Data": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
    "Garis dan Sudut": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
    default: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" }
  };

  const getCategoryStyle = (categoryName) => {
    if (!categoryName) return categoryColors.default;
    
    for (const [key, value] of Object.entries(categoryColors)) {
      if (categoryName.includes(key)) {
        return value;
      }
    }
    
    return categoryColors.default;
  };

  const currentCategoryStyle = getCategoryStyle(material?.title);

  // ✅ Ambil user ID dari JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("❌ Token tidak valid:", err);
      }
    }
  }, []);

  // ✅ Ambil semua materi untuk rekomendasi
  useEffect(() => {
    const fetchAllMaterials = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/materials",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllMaterials(res.data.data);
      } catch (err) {
        console.error("❌ Gagal mengambil semua materi:", err);
      }
    };

    fetchAllMaterials();
  }, []);

  // ✅ Ambil data materi
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materiId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/materials/${materiId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMaterial(res.data.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data materi:", err);
      }
    };

    fetchMaterial();
  }, [materiId]);

  // ✅ Ambil soal kuis
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!materiId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/materi/${materiId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil soal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [materiId]);

  // ✅ Simpan hasil kuis & berikan badge
  useEffect(() => {
    const submitResults = async () => {
      if (!showResult || !userId || questions.length === 0) return;

      const token = localStorage.getItem("token");
      const score = correctAnswers;
      const totalQuestions = questions.length;
      const currentScoreRatio = score / totalQuestions;
      setScoreRatio(currentScoreRatio);

      try {
        await axios.post(
          "http://localhost:5000/api/quiz-results",
          {
            materialId: materiId,
            category: material?.category?._id,
            score,
            totalQuestions,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await axios.post(
          "http://localhost:5000/api/badge/kuis",
          {
            category: material?.category?.name,
            materialId: materiId,
            score,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (currentScoreRatio >= 0.7) {
          await axios.post(
            "http://localhost:5000/api/badge/material-badge",
            {
              materialId: materiId,
              badgeName: `Master ${material?.title || "Materi"}`,
              icon: "🏅",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Setelah menyimpan hasil, tentukan rekomendasi materi
        determineRecommendedMaterials(currentScoreRatio);
      } catch (err) {
        console.error("❌ Gagal menyimpan hasil atau memberi badge:", err);
      }
    };

    submitResults();
  }, [showResult, userId, correctAnswers, questions.length, material, materiId]);

  // Fungsi untuk menentukan materi rekomendasi
const determineRecommendedMaterials = (scoreRatio) => {
  if (!allMaterials.length || !material) return;

  const currentMaterialTitle = material.title;
  
  // Find current material's position in the ordered sequence
  const currentIndex = orderedCategories.findIndex(cat => 
    currentMaterialTitle.includes(cat)
  );

  console.log('Current material:', currentMaterialTitle);
  console.log('Current index:', currentIndex);
  console.log('All materials:', allMaterials);

  let recommendations = [];

  if (scoreRatio >= 0.75) {
    // If current material is found in our sequence and not the last one
    if (currentIndex >= 0 && currentIndex < orderedCategories.length - 1) {
      const nextCategory = orderedCategories[currentIndex + 1];
      console.log('Next category to recommend:', nextCategory);
      
      // Find all materials matching the next category
      recommendations = allMaterials.filter(mat => {
        const includesCategory = mat.title.includes(nextCategory);
        const isNotCurrent = mat._id !== materiId;
        console.log(`Material ${mat.title} - includes ${nextCategory}: ${includesCategory}`);
        return includesCategory && isNotCurrent;
      });
      
      console.log('Filtered recommendations:', recommendations);
    }
    // If current material is last in sequence or not found in sequence
    if (recommendations.length === 0) {
      recommendations = allMaterials
        .filter(mat => mat._id !== materiId)
        .slice(0, 3);
    }
  } 
  // For scores < 75%, recommend current material for review
  else {
    recommendations = [material];
  }

  // Fallback if no recommendations found
  if (recommendations.length === 0) {
    recommendations = [material];
  }

  console.log('Final recommendations:', recommendations);
  setRecommendedMaterials(recommendations);
};
  const handleAnswer = () => {
    if (selected === questions[current].correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected("");
    } else {
      setShowResult(true);
    }
  };

  const navigateToMaterial = (materialId) => {
    navigate(`/materi/${category}?materiId=${materialId}`);
  };

  const retakeQuiz = () => {
    setCurrent(0);
    setSelected("");
    setCorrectAnswers(0);
    setShowResult(false);
  };

  if (!materiId) {
    return <p className="p-4 text-red-600">❌ Materi ID tidak ditemukan di URL</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden ${currentCategoryStyle.border}`}>
          {/* Header dengan warna kategori */}
          <div className={`${currentCategoryStyle.bg} px-6 py-4`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-semibold ${currentCategoryStyle.text}`}>
                  BAB: {material?.category?.name || "Loading..."}
                </p>
                <h1 className="text-2xl font-bold text-gray-800 mt-1">
                  Kuis: {material?.title || "Memuat..."}
                </h1>
              </div>
              <div className={`px-3 py-1 rounded-full ${currentCategoryStyle.bg} border ${currentCategoryStyle.border} text-sm font-medium ${currentCategoryStyle.text}`}>
                {category}
              </div>
            </div>
          </div>

          {/* Konten utama */}
          <div className="bg-white px-6 py-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Soal tidak tersedia</h3>
                <p className="text-gray-500">Tidak ada soal yang ditemukan untuk materi ini.</p>
              </div>
            ) : !showResult ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Soal {current + 1} dari {questions.length}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                      {Math.round(((current + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${currentCategoryStyle.bg} h-2 rounded-full`} 
                      style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-lg font-medium text-gray-800 mb-6">
                    {questions[current].question}
                  </p>
                  <div className="space-y-3">
                    {questions[current].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelected(option)}
                        className={`w-full px-4 py-3 text-left rounded-lg border transition-all duration-200 ${
                          selected === option
                            ? `${currentCategoryStyle.border} ${currentCategoryStyle.bg} ring-2 ${currentCategoryStyle.border}`
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAnswer}
                    disabled={!selected}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      selected
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {current + 1 === questions.length ? "Selesai & Lihat Hasil" : "Lanjut ke Soal Berikutnya"}
                  </button>
                </div>
              </>
            ) : (
              <div>
                {/* Hasil Kuis */}
                <div className={`text-center p-6 mb-8 rounded-lg ${currentCategoryStyle.bg} ${currentCategoryStyle.border} border`}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-4">
                    {scoreRatio >= 0.75 ? (
                      <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {scoreRatio >= 0.75 ? "Selamat! 🎉" : "Hasil Kuis"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Kamu menjawab <strong>{correctAnswers}</strong> dari <strong>{questions.length}</strong> soal dengan benar
                  </p>
                  <div className="flex justify-center mb-4">
                    <div className="w-full max-w-xs bg-white rounded-full h-4">
                      <div 
                        className={`${scoreRatio >= 0.75 ? 'bg-green-500' : 'bg-blue-500'} h-4 rounded-full`}
                        style={{ width: `${(correctAnswers / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xl font-bold mb-2">
                    Skor: <span className={scoreRatio >= 0.75 ? 'text-green-600' : 'text-blue-600'}>
                      {Math.round((correctAnswers / questions.length) * 100)}/100
                    </span>
                  </p>
                  <p className={`text-sm font-medium ${scoreRatio >= 0.75 ? 'text-green-600' : 'text-blue-600'}`}>
                    {scoreRatio >= 0.75 
                      ? "Kamu menguasai materi ini dengan baik!" 
                      : "Terus berlatih untuk meningkatkan pemahamanmu!"}
                  </p>
                </div>

                {/* Rekomendasi Materi */}
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {scoreRatio >= 0.75 ? "Rekomendasi Materi Selanjutnya" : "Saran Pembelajaran"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {scoreRatio >= 0.75 
                      ? "Berhasil! Kamu bisa melanjutkan ke materi berikut:" 
                      : "Agar lebih paham, kami sarankan untuk:"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedMaterials.map((mat) => {
                      const matCategoryStyle = getCategoryStyle(mat.title);
                      return (
                        <div 
                          key={mat._id}
                          className={`border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${matCategoryStyle.border}`}
                        >
                          <div className={`${matCategoryStyle.bg} px-4 py-3`}>
                            <h4 className={`font-semibold text-lg ${matCategoryStyle.text}`}>
                              {mat.title}
                            </h4>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {scoreRatio >= 0.75 
                                ? mat.description 
                                : "Ulangi materi ini untuk memperdalam pemahamanmu"}
                            </p>
                            {scoreRatio >= 0.75 ? (
                              <button
                                onClick={() => navigateToMaterial(mat._id)}
                                className={`w-full ${matCategoryStyle.bg} hover:opacity-90 text-white py-2 rounded-md text-sm font-medium transition`}
                              >
                                Pelajari Sekarang
                              </button>
                            ) : (
                              <button
                                onClick={retakeQuiz}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition`}
                              >
                                Ulangi Kuis Ini
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Quiz;