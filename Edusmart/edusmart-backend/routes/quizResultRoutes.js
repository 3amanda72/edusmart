const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  simpanHasilKuis,
  getRiwayatKuisSaya,
} = require("../controllers/quizResultController");
// Debugging: Cek apakah simpanHasilKuis sudah diimport dengan benar
console.log("Tipe simpanHasilKuis:", typeof simpanHasilKuis);

// [POST] Simpan hasil kuis
router.post("/", auth, simpanHasilKuis);

// [GET] Riwayat kuis milik user saat ini
router.get("/me", auth, getRiwayatKuisSaya);

module.exports = router;
