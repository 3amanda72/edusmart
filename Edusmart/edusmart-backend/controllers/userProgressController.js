// controllers/userProgressController.js

const UserProgress = require("../models/UserProgress");
const Category = require("../models/Category");

// ✅ Simpan progres user berdasarkan materialId
const saveUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const materialId = req.params.materialId;

    const existingProgress = await UserProgress.findOne({ user: userId, material: materialId });

    if (existingProgress) {
      return res.status(200).json({ message: "Progres sudah ada" });
    }

    const newProgress = new UserProgress({
      user: userId,
      material: materialId,
    });

    await newProgress.save();

    res.status(201).json({ message: "Progres disimpan" });
  } catch (error) {
    console.error("❌ Gagal menyimpan progres:", error);
    res.status(500).json({ message: "Gagal menyimpan progres" });
  }
};

// ✅ Ambil data progres berdasarkan kategori (BAB)
const getUserCategoryProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Ambil semua progres user
    const userProgress = await UserProgress.find({ user: userId }).populate("material");

    // Hitung jumlah progres per kategori
    const progressByCategory = {};

    userProgress.forEach((progress) => {
      const categoryId = progress.material.category.toString();
      if (!progressByCategory[categoryId]) {
        progressByCategory[categoryId] = 0;
      }
      progressByCategory[categoryId]++;
    });

    res.status(200).json(progressByCategory);
  } catch (error) {
    console.error("❌ Gagal mengambil progres kategori:", error);
    res.status(500).json({ message: "Gagal mengambil progres kategori" });
  }
};

// ✅ Tentukan index kategori yang bisa dibuka oleh user
const getUnlockedCategoryIndex = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await Category.find().sort({ order: 1 });

    const userProgress = await UserProgress.find({ user: userId }).populate("material");

    const completedCategoryIds = new Set(
      userProgress.map((progress) => progress.material.category.toString())
    );

    // Cek index terakhir yang memiliki progres
    let unlockedIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const isCompleted = completedCategoryIds.has(category._id.toString());
      if (!isCompleted) {
        break;
      }
      unlockedIndex = i + 1;
    }

    res.status(200).json({ index: unlockedIndex });
  } catch (error) {
    console.error("❌ Gagal mendapatkan index kategori:", error);
    res.status(500).json({ message: "Gagal mendapatkan index kategori" });
  }
};

module.exports = {
  saveUserProgress,
  getUserCategoryProgress,
  getUnlockedCategoryIndex,
};
