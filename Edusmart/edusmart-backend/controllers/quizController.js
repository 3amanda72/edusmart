const Quiz = require("../models/Quiz");
const User = require("../models/User");

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name email");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil kuis" });
  }
};

const getQuizByMateri = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ materi: req.params.materiId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil kuis berdasarkan materi" });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, materi } = req.body;
    const createdBy = req.user._id; // Ambil dari token auth

    const newQuiz = new Quiz({
      question,
      options,
      correctAnswer,
      materi,
      createdBy
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat kuis" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, materi } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer, materi },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Kuis tidak ditemukan" });
    }

    res.json(updatedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui kuis" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Kuis tidak ditemukan" });
    }

    res.json({ message: "Kuis berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus kuis" });
  }
};

const getTotalQuizzes = async (req, res) => {
  try {
    const total = await Quiz.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error("Gagal mengambil total kuis:", err);
    res.status(500).json({ message: "Gagal mengambil total kuis" });
  }
};

module.exports = {
  getQuizzes,
  getQuizByMateri,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getTotalQuizzes
};
