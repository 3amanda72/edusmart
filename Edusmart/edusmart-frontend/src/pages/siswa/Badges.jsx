import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const getNextBadgeInfo = (poin) => {
  if (poin >= 81) return { berikutnya: "🏆 Gold (Maksimal)", dibutuhkan: 0 };
  if (poin >= 61) return { berikutnya: "🥈 Silver", dibutuhkan: 81 - poin };
  if (poin >= 0) return { berikutnya: "🥉 Bronze", dibutuhkan: 61 - poin };
  return { berikutnya: "✨ Pemula", dibutuhkan: 0 };
};

const Badges = () => {
  const [dataBadge, setDataBadge] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState(null);
  const [badgeTerpilih, setBadgeTerpilih] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelInfo, setLevelInfo] = useState({ previous: 1, current: 1 });
  const [badgeClicked, setBadgeClicked] = useState(false);

  useEffect(() => {
    const ambilDataBadge = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Harap login untuk melihat badge");

        const res = await axios.get("http://localhost:5000/api/badge/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataTerformat = {
          ...res.data,
          badgeGlobal: res.data.globalBadge || { namaBadge: "Pemula" },
          kategori: res.data.categories || [],
          badgeMateri: res.data.materialBadges || [],
          totalPoin: res.data.totalPoints || 0,
          level: res.data.level || 1,
          totalKuis: res.data.totalQuizzes || 0
        };
        
        // Check for level up
        if (dataBadge && dataTerformat.level > dataBadge.level) {
          setLevelInfo({
            previous: dataBadge.level,
            current: dataTerformat.level
          });
          setShowLevelUp(true);
        }
        
        setDataBadge(dataTerformat);
      } catch (err) {
        console.error("Gagal mengambil data badge:", err);
        setError(err.response?.data?.message || "Gagal memuat data badge");
      } finally {
        setMemuat(false);
      }
    };

    ambilDataBadge();
  }, []);

  const handleBadgeClick = (badgeData) => {
    setBadgeTerpilih(badgeData);
    
    // Jika badge diklik dan level berbeda dengan sebelumnya
    if (dataBadge && badgeData.level && badgeData.level !== dataBadge.level) {
      setLevelInfo({
        previous: dataBadge.level,
        current: badgeData.level
      });
      setBadgeClicked(true);
      setShowLevelUp(true);
    }
  };

  const badgeBerikutnya = dataBadge ? getNextBadgeInfo(dataBadge.totalPoin) : null;
  const persentaseProgres = dataBadge
    ? Math.min((dataBadge.totalPoin / 81) * 100, 100)
    : 0;

  const getWarnaBadge = (namaBadge) => {
    switch(namaBadge) {
      case "Emas": return "bg-yellow-100 text-yellow-800";
      case "Perak": return "bg-gray-100 text-gray-800";
      case "Perunggu": return "bg-amber-100 text-amber-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Level Up Popup */}
          {showLevelUp && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className={`bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden ${badgeClicked ? 'animate-jump' : 'animate-bounce'}`}>
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Level Up!</h2>
                  <p className="text-xl text-gray-700 mb-6">
                    Selamat! Kamu naik dari level {levelInfo.previous} ke level {levelInfo.current}
                  </p>
                  <button
                    onClick={() => {
                      setShowLevelUp(false);
                      setBadgeClicked(false);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bagian Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <span className="text-4xl">🏆</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Pencapaian Kamu
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lacak perkembangan belajar dan badge yang telah diperoleh
            </p>
          </div>

          {/* Status Memuat */}
          {memuat && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Status Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-red-500">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Konten Utama */}
          {dataBadge && (
            <div className="space-y-12">
              {/* Kartu Statistik */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-full ${getWarnaBadge(dataBadge.badgeGlobal?.namaBadge)}`}>
                        <span className="text-2xl">
                          {dataBadge.badgeGlobal?.namaBadge === "Golde" ? "🏆" : 
                           dataBadge.badgeGlobal?.namaBadge === "Silver" ? "🥈" : 
                           dataBadge.badgeGlobal?.namaBadge === "Bronze" ? "🥉" : "✨"}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {dataBadge.badgeGlobal?.namaBadge || "Pemula"}
                        </h2>
                        <p className="text-gray-600">Badge saat ini</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Level</p>
                        <p className="text-2xl font-bold text-blue-600">{dataBadge.level}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Poin</p>
                        <p className="text-2xl font-bold text-green-600">{dataBadge.totalPoin}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Kuis</p>
                        <p className="text-2xl font-bold text-purple-600">{dataBadge.totalKuis}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progres menuju {badgeBerikutnya?.berikutnya}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(persentaseProgres)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${persentaseProgres}%` }}
                    ></div>
                  </div>
                  {badgeBerikutnya?.dibutuhkan > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      Butuh <span className="font-semibold">{badgeBerikutnya.dibutuhkan} poin lagi</span> untuk mencapai {badgeBerikutnya.berikutnya}
                    </p>
                  )}
                </div>
              </div>

              {/* Badge Kategori */}
              {dataBadge.kategori.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">📚</span> Badge Kategori
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataBadge.kategori
                      .filter(kat => kat.status === "Completed")
                      .map((kat, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleBadgeClick({ ...kat, level: dataBadge.level })}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 p-3 rounded-full">
                                <span className="text-xl">📖</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{kat.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {kat.materialsDone || 0} materi • {kat.quizzesDone || 0} kuis
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 px-4 py-2 text-sm text-blue-700">
                            Selesai
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Badge Materi */}
              {dataBadge.badgeMateri.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-purple-600">🎯</span> Badge Materi
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dataBadge.badgeMateri.map((mat, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleBadgeClick({ ...mat, level: dataBadge.level })}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer text-center"
                      >
                        <div className="p-6">
                          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">{mat.icon || "📝"}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{mat.materialTitle}</h4>
                          <p className="text-sm text-purple-600 mb-2">{mat.badgeName}</p>
                          <p className="text-xs text-gray-500">
                            Diperoleh: {new Date(mat.earnedAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Kosong */}
          {!memuat && !error && !dataBadge && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Badge</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Mulai belajar dan selesaikan kuis untuk mendapatkan badge pertamamu!
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Mulai Belajar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Badge */}
      {badgeTerpilih && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setBadgeTerpilih(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">
                    {badgeTerpilih.isKategori ? "📚" : (badgeTerpilih.icon || "🏅")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {badgeTerpilih.isKategori ? badgeTerpilih.name : badgeTerpilih.materialTitle}
                </h2>
                {!badgeTerpilih.isKategori && (
                  <p className="text-blue-600">{badgeTerpilih.badgeName}</p>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                {badgeTerpilih.isKategori ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-blue-500 mt-0.5">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Materi Diselesaikan:</span> {badgeTerpilih.materialsDone || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-blue-500 mt-0.5">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Kuis Diselesaikan:</span> {badgeTerpilih.quizzesDone || 0}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-blue-500 mt-0.5">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Diperoleh pada:</span> {new Date(badgeTerpilih.earnedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => alert("Fitur berbagi akan segera hadir!")}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Bagikan Pencapaian
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Badges;