import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaMedal,
  FaBook,
  FaUserCircle,
  FaSignOutAlt,
  FaChartLine,
  FaGraduationCap
} from "react-icons/fa";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";

const DashboardStudent = () => {
  const [userData, setUserData] = useState({
    name: "",
    badge: "Bronze",
    level: 1,
    totalPoints: 0,
    totalQuizzes: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserData(prev => ({ ...prev, loading: false, error: "Token tidak ditemukan" }));
        return;
      }

      try {
        const [userRes, badgeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/badge/me", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUserData({
          name: userRes.data.name || "Siswa",
          badge: badgeRes.data.globalBadge?.badgeName || "Bronze",
          level: badgeRes.data.level || 1,
          totalPoints: badgeRes.data.totalPoints || 0,
          totalQuizzes: badgeRes.data.totalQuizzes || badgeRes.data.totalKuis || 0,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setUserData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || "Gagal memuat data dashboard"
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const renderBadgeIcon = () => {
    switch(userData.badge) {
      case "Gold": return "🥇";
      case "Silver": return "🥈";
      default: return "🥉";
    }
  };

  if (userData.loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (userData.error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-4">{userData.error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-10 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <FaGraduationCap className="text-5xl text-blue-700" />
            <h1 className="text-4xl font-bold text-blue-800">
              Dashboard Siswa - EduSmart
            </h1>
          </div>

          {/* Welcome Banner */}
          <div className="bg-blue-50 py-8 px-6 text-center shadow-sm mb-10 rounded-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
              Selamat Datang, {userData.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Semangat belajar hari ini! Ayo capai level dan badge terbaikmu di EduSmart ✨
            </p>
          </div>

          {/* Statistik Belajar */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Statistik Belajar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Level */}
              <div className="bg-white rounded-2xl shadow-md p-5 text-center border-t-4 border-blue-600">
                <p className="text-sm text-gray-500 mb-1">Level</p>
                <p className="text-3xl font-bold text-blue-700">{userData.level}</p>
              </div>
              
              {/* Total Poin */}
              <div className="bg-white rounded-2xl shadow-md p-5 text-center border-t-4 border-green-500">
                <p className="text-sm text-gray-500 mb-1">Total Poin</p>
                <p className="text-3xl font-bold text-green-600">{userData.totalPoints}</p>
              </div>
              
              {/* Total Kuis */}
              <div className="bg-white rounded-2xl shadow-md p-5 text-center border-t-4 border-indigo-500">
                <p className="text-sm text-gray-500 mb-1">Total Kuis</p>
                <p className="text-3xl font-bold text-indigo-600">{userData.totalQuizzes}</p>
              </div>
              
              {/* Lencana */}
              <div className="bg-white rounded-2xl shadow-md p-5 text-center border-t-4 border-yellow-400">
                <p className="text-sm text-gray-500 mb-1">Lencana</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl">{renderBadgeIcon()}</span>
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    {userData.badge}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Tentang EduSmart */}
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16">
              {/* Text Section */}
              <div>
                <h2 className="text-3xl font-bold text-blue-800 mb-4">
                  Apa itu EduSmart
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>EduSmart</strong> adalah platform pembelajaran digital yang menggabungkan konsep <strong>gamifikasi</strong> dengan <strong>evaluasi berkelanjutan</strong>.  
                  Siswa bisa belajar materi sesuai kurikulum, mengikuti kuis otomatis, dan mendapatkan lencana serta naik level seiring peningkatan kemampuan mereka.  
                  Dengan leaderboard dan sistem poin, semangat belajar siswa akan terus terjaga secara menyenangkan.
                </p>
              </div>

              {/* Ilustrasi Gambar */}
              <div className="flex justify-center">
                <img
                  src="../assets/images/overview-edusmart.jpg"
                  alt="Overview EduSmart"
                  className="w-full max-w-md rounded-xl shadow-md"
                />
              </div>
            </div>

            {/* Fitur-fitur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Materi */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaBook className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">📘 Materi Interaktif</h3>
                  <p className="text-gray-600">
                    Materi dirancang per bab (kategori), dengan penjelasan visual dan interaktif. Setiap bab memiliki beberapa topik dan diakhiri dengan kuis.
                  </p>
                </div>
              </div>

              {/* Kuis */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaChartLine className="text-2xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">📝 Kuis Otomatis</h3>
                  <p className="text-gray-600">
                    Uji kemampuanmu setelah mempelajari materi! Kuis otomatis akan memberikan poin dan mempengaruhi level belajarmu.
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <FaMedal className="text-2xl text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-yellow-700 mb-2">🏅 Sistem Lencana</h3>
                  <p className="text-gray-600">
                    Raih berbagai lencana untuk pencapaian seperti menyelesaikan bab, mendapatkan nilai tinggi, atau aktif mengikuti kuis.
                  </p>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 flex items-start gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FaUserCircle className="text-2xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-700 mb-2">📈 Leaderboard & Level</h3>
                  <p className="text-gray-600">
                    Lihat peringkatmu dan teman-temanmu! Naik level seiring poin yang kamu kumpulkan, dan jadilah siswa terbaik di leaderboard.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-100 py-14 rounded-2xl shadow-inner px-6 text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Siap Mulai Belajar?</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Jelajahi materi berdasarkan kategori (BAB), kerjakan kuis, dan capai pencapaian luar biasa bersama EduSmart!
            </p>
            <Link
              to="/materials"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold px-8 py-3 rounded-full transition shadow-md"
            >
              📚 Belajar Sekarang
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DashboardStudent;