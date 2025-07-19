const mongoose = require("mongoose"); // ✅ pastikan ini ada
const QuizResult = require("../models/QuizResult");
const BadgeProgress = require("../models/BadgeProgress");
const {
  calculateLevel,
  determineBadge,
  giveMaterialBadge,
} = require("./badgeController");

// [POST] Simpan hasil kuis dan update progress
const simpanHasilKuis = async (req, res) => {
  try {
    const { category, score = 0, totalQuestions = 0, materialId } = req.body;
    const userId = req.user?.id;

    // Validasi input
    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi." });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ message: "Kategori kuis wajib diisi dan harus berupa teks." });
    }

    if (typeof totalQuestions !== "number" || totalQuestions <= 0) {
      return res.status(400).json({ message: "Jumlah soal harus lebih dari 0." });
    }

    if (typeof score !== "number" || score < 0) {
      return res.status(400).json({ message: "Skor harus berupa angka positif." });
    }

    if (!materialId) {
      return res.status(400).json({ message: "materialId wajib diisi." });
    }

    // ✅ Gunakan "new" untuk membuat ObjectId
    const newResult = new QuizResult({
      userId,
      category,
      score,
      totalQuestions,
      materialId: new mongoose.Types.ObjectId(materialId),
    });

    await newResult.save();

    // Cek dan update progress badge
    let progress = await BadgeProgress.findOne({ userId });

    if (!progress) {
      progress = new BadgeProgress({
        userId,
        totalPoints: 0,
        level: 1,
        badge: "Pemula",
        completedCategories: [],
      });
    }

    progress.totalPoints += score;
    progress.level = calculateLevel(progress.totalPoints);
    progress.badge = determineBadge(progress.totalPoints);

    const existingCategory = progress.completedCategories.find(
      (item) => item.category === category
    );

    if (existingCategory) {
      existingCategory.quizzesDone += 1;
    } else {
      progress.completedCategories.push({
        category,
        materialsDone: 0,
        quizzesDone: 1,
      });
    }

    await progress.save();

    // Tambah badge khusus materi
    if (materialId) {
      await giveMaterialBadge(userId, materialId, score);
    }

    return res.status(201).json({ message: "✅ Hasil kuis berhasil disimpan!" });
  } catch (error) {
    console.error("❌ Gagal menyimpan hasil kuis:", error);
    return res.status(500).json({ message: "Gagal menyimpan hasil kuis." });
  }
};

// [GET] Ambil semua hasil kuis milik user
const getRiwayatKuisSaya = async (req, res) => {
  try {
    const userId = req.user.id;

    const hasilKuis = await QuizResult.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(hasilKuis);
  } catch (error) {
    console.error("❌ Gagal mengambil riwayat kuis:", error);
    return res.status(500).json({ message: "Gagal mengambil riwayat kuis." });
  }
};

module.exports = {
  simpanHasilKuis,
  getRiwayatKuisSaya,
};
