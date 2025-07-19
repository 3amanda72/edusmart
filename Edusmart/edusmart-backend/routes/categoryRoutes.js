const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/verifyToken");

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalCategories
} = require("../controllers/categoryController");

// ❗ Penting: definisikan route spesifik dulu
router.get("/total", verifyToken, getTotalCategories);

// Route dinamis ditaruh setelahnya
router.get("/", getAllCategories);
router.post("/", auth, createCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
