const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploadMiddleware");

const {
  getAllMaterials,
  getMaterialsByCategory,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getTotalMaterials,
  getMaterialsWithProgress,
  saveUserProgress,
} = require("../controllers/materialController");

/**
 * 📊 [GET] Ambil progres belajar siswa dalam kategori tertentu
 * Endpoint: /progress/:categoryId
 */
router.get("/progress/:categoryId", auth, getMaterialsWithProgress);

/**
 * ✅ [POST] Simpan progres siswa pada suatu materi
 * Endpoint: /progress/:materialId
 */
router.post("/progress/:materialId", auth, saveUserProgress);

/**
 * 🔢 [GET] Ambil total materi (untuk admin/guru)
 * Harus diletakkan sebelum route dinamis '/:id' untuk mencegah konflik
 * Endpoint: /total
 */
router.get("/total", verifyToken, getTotalMaterials);

/**
 * 📋 [GET] Ambil semua materi (admin/guru)
 * Endpoint: /
 */
router.get("/", auth, getAllMaterials);

/**
 * 📚 [GET] Ambil materi berdasarkan kategori (utama untuk siswa)
 * Endpoint: /categories/:categoryId
 */
router.get("/categories/:categoryId", auth, getMaterialsByCategory);

/**
 * 🧑‍🏫 [GET] Alternatif ambil materi berdasarkan kategori (guru/admin)
 * Endpoint: /by-category/:categoryId
 */
router.get("/by-category/:categoryId", auth, getMaterialsByCategory);

/**
 * 📄 [GET] Detail materi berdasarkan ID
 * Endpoint: /:id
 */
router.get("/:id", auth, getMaterialById);

/**
 * ➕ [POST] Tambah materi baru (dengan file opsional)
 * Endpoint: /
 */
router.post("/", auth, upload.single("file"), createMaterial);

/**
 * ✏️ [PUT] Update materi berdasarkan ID (dengan file opsional)
 * Endpoint: /:id
 */
router.put("/:id", auth, upload.single("file"), updateMaterial);

/**
 * ❌ [DELETE] Hapus materi berdasarkan ID
 * Endpoint: /:id
 */
router.delete("/:id", auth, deleteMaterial);

module.exports = router;
