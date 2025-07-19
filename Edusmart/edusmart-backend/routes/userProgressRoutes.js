// routes/userProgressRoutes.js

const express = require("express");
const router = express.Router();

const {
  saveUserProgress,
  getUserCategoryProgress,
  getUnlockedCategoryIndex
} = require("../controllers/userProgressController"); // Pastikan controller ini benar

const { protect } = require("../middlewares/authMiddleware");

// ✅ Route untuk mendapatkan progres kategori yang telah diselesaikan user
router.get("/categories", protect, getUserCategoryProgress);

// ✅ Route untuk mendapatkan index kategori terakhir yang sudah dibuka
router.get("/categories/index", protect, getUnlockedCategoryIndex);

// ✅ Route untuk menyimpan progres user berdasarkan materialId
router.post("/:materialId", protect, saveUserProgress);

module.exports = router;
