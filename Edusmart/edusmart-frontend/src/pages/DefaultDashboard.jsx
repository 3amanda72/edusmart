import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
const DefaultDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaGraduationCap className="text-5xl text-blue-700" />
          <h1 className="text-4xl font-bold text-blue-800">Selamat Datang di EduSmart</h1>
        </div>

        <div className="bg-blue-50 py-8 px-6 text-center shadow-sm mb-10 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            Platform Pembelajaran Interaktif & Gamifikasi 📚✨
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            EduSmart dirancang untuk membuat proses belajar menjadi menyenangkan, terstruktur, dan penuh tantangan. Login untuk mulai belajar atau mengelola materi!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <button
              onClick={() => navigate("/login/siswa")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              🎓 Login Siswa
            </button>
            <button
              onClick={() => navigate("/login/guru")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              🧑‍🏫 Login Guru
            </button>
          </div>
        </div>

        {/* Penjelasan Fitur EduSmart */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16">
            {/* Penjelasan */}
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-4">Apa itu EduSmart</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>EduSmart</strong> adalah platform pembelajaran digital yang menggabungkan <strong>gamifikasi</strong> dan <strong>evaluasi otomatis</strong>.  
                Siswa belajar dari materi interaktif, mengerjakan kuis yang menantang, dan meraih badge serta naik level. Guru dapat dengan mudah mengelola materi, kuis, dan memantau perkembangan siswa.
              </p>
            </div>

            {/* Ilustrasi */}
            <div className="flex justify-center">
              <img
                src="../assets/images/overview-edusmart.jpg"
                alt="Overview EduSmart"
                className="w-full max-w-md"
              />
            </div>
          </div>

          {/* Kartu fitur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Materi */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600 flex items-start gap-4">
              <img src="../assets/images/Materi-card.jpg" alt="Materi" className="w-24 h-24 object-contain" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">📘 Materi Interaktif</h3>
                <p className="text-gray-600">
                  Setiap BAB dirancang secara visual dan mudah dipahami. Dilengkapi kuis untuk mengukur pemahaman siswa.
                </p>
              </div>
            </div>

            {/* Kuis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600 flex items-start gap-4">
              <img src="../assets/images/Quiz-card.jpg" alt="Kuis" className="w-24 h-24 object-contain" />
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">📝 Kuis Otomatis</h3>
                <p className="text-gray-600">
                  Kuis akan memberikan poin dan membantu siswa naik level. Jawaban dikoreksi otomatis dan langsung diberikan skor.
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 flex items-start gap-4">
              <img src="https://storyset.com/illustration/achievement/rafiki" alt="Badge" className="w-24 h-24 object-contain" />
              <div>
                <h3 className="text-xl font-semibold text-yellow-700 mb-2">🏅 Sistem Lencana</h3>
                <p className="text-gray-600">
                  EduSmart memberikan penghargaan untuk setiap pencapaianmu: mulai dari menyelesaikan materi hingga performa terbaik dalam kuis.
                </p>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 flex items-start gap-4">
              <img src="https://storyset.com/illustration/ranking/rafiki" alt="Leaderboard" className="w-24 h-24 object-contain" />
              <div>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">📈 Leaderboard & Level</h3>
                <p className="text-gray-600">
                  Kamu bisa bersaing sehat dengan teman-temanmu dalam leaderboard dan naik level berdasarkan total poin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Ajak Login */}
        <section className="bg-blue-100 py-14 rounded-2xl shadow-inner px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Gabung dan Mulai Belajar Sekarang!</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Login untuk menjelajahi materi, menyelesaikan kuis, dan kumpulkan badge sebanyak-banyaknya!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/login/siswa")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full text-lg font-semibold"
            >
              🎓 Login sebagai Siswa
            </button>
            <button
              onClick={() => navigate("/login/guru")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold"
            >
              🧑‍🏫 Login sebagai Guru
            </button>
          </div>
        </section>
      </div>
    </div>
        <Footer />
    </>
  );
};

export default DefaultDashboard;
