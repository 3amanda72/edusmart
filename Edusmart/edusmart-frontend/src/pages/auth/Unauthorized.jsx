import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import Footer from "../../layouts/Footer";
import { FaBan } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center text-center px-6 py-20">
        <FaBan className="text-red-500 text-6xl mb-6" />
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">403 - Akses Ditolak</h1>
        <p className="text-gray-700 text-lg mb-6 max-w-xl">
          Maaf, kamu tidak memiliki izin untuk mengakses halaman ini. Pastikan kamu telah login dengan peran yang sesuai.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow"
        >
          🔙 Kembali ke Beranda
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default Unauthorized;
