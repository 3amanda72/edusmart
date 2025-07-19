const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/verifyToken");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTotalUsers,
  getCurrentUser
} = require("../controllers/userController");

// Statistik jumlah user harus di atas "/:id"
router.get("/total", verifyToken, getTotalUsers);
router.get("/me", verifyToken, getCurrentUser);

// User routes
router.get("/", auth, getUsers);
router.post("/", auth, createUser);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
