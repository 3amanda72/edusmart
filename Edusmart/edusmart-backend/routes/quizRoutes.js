const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getQuizzes,
  getQuizByMateri,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getTotalQuizzes,
} = require("../controllers/quizController");

router.get("/", auth, getQuizzes);
router.get("/materi/:materiId", auth, getQuizByMateri); // khusus per materi
router.post("/", auth, createQuiz);
router.put("/:id", auth, updateQuiz);
router.delete("/:id", auth, deleteQuiz);
router.get("/total", auth, getTotalQuizzes);

module.exports = router;
