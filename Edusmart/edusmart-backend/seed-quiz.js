const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Quiz = require("./models/Quiz");
const Material = require("./models/Material");
const User = require("./models/User");
require("dotenv").config();

const seedQuiz = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log("❌ Tidak ada user ditemukan. Seeding dibatalkan.");
      return process.exit(1);
    }

    // Ambil materi
    const aljabar = await Material.findOne({ title: "Aljabar" });
    const perbandingan = await Material.findOne({ title: "Perbandingan" });
    const ips = await Material.findOne({ title: "IPS" });

    if (!aljabar || !perbandingan || !ips) {
      console.log("❌ Materi belum lengkap. Pastikan Aljabar, Perbandingan, dan IPS tersedia.");
      return process.exit(1);
    }

    const quizData = [
      // ✅ Aljabar
      {
        question: "Jika x + 5 = 10, maka x = ?",
        options: ["5", "10", "15"],
        correctAnswer: "5",
        materi: aljabar._id,
        createdBy: user._id,
      },
      {
        question: "Hasil dari 3x = 12 adalah?",
        options: ["4", "3", "5"],
        correctAnswer: "4",
        materi: aljabar._id,
        createdBy: user._id,
      },

      // ✅ Perbandingan
      {
        question: "Jika rasio uang Andi dan Budi adalah 2:3 dan Andi punya Rp20.000, berapa uang Budi?",
        options: ["Rp30.000", "Rp40.000", "Rp25.000"],
        correctAnswer: "Rp30.000",
        materi: perbandingan._id,
        createdBy: user._id,
      },
      {
        question: "Harga 5 buku adalah Rp50.000. Maka 1 buku seharga?",
        options: ["Rp10.000", "Rp12.000", "Rp8.000"],
        correctAnswer: "Rp10.000",
        materi: perbandingan._id,
        createdBy: user._id,
      },

      // ✅ IPS
      {
        question: "Tanggal Proklamasi Kemerdekaan Indonesia adalah?",
        options: ["17 Agustus 1945", "1 Juni 1945", "10 November 1945"],
        correctAnswer: "17 Agustus 1945",
        materi: ips._id,
        createdBy: user._id,
      },
      {
        question: "Lembaga legislatif di Indonesia disebut?",
        options: ["DPR", "MA", "KPK"],
        correctAnswer: "DPR",
        materi: ips._id,
        createdBy: user._id,
      },
    ];

    // Kosongkan quiz lama (opsional)
    await Quiz.deleteMany();

    // Masukkan data baru
    await Quiz.insertMany(quizData);
    console.log("✅ Soal kuis berhasil dimasukkan untuk Aljabar, Perbandingan, dan IPS!");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal seeding soal kuis:", err.message);
    process.exit(1);
  }
};

seedQuiz();
