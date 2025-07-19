const QuizResult = require("../models/QuizResult");
const User = require("../models/User");

// ✅ Fungsi untuk mendapatkan total skor dan rata-rata skor dari semua hasil kuis
const getTotalLeaderboard = async (req, res) => {
  try {
    const result = await QuizResult.aggregate([
      {
        $group: {
          _id: null,
          totalScore: { $sum: "$score" },
          avgScore: { $avg: "$score" },
        },
      },
      {
        $project: {
          _id: 0,
          totalScore: 1,
          avgScore: { $round: ["$avgScore", 2] }
        },
      },
    ]);

    res.status(200).json(result[0] || { totalScore: 0, avgScore: 0 });
  } catch (err) {
    console.error("❌ Gagal mengambil total leaderboard:", err);
    res.status(500).json({ message: "Gagal mengambil total leaderboard" });
  }
};

// ✅ Fungsi utama untuk mengambil top 10 leaderboard siswa (dapat difilter per kategori)
const getLeaderboard = async (req, res) => {
  try {
    const { category } = req.query;
    const matchStage = category ? { category } : {};

    const leaderboard = await QuizResult.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          avgScore: { $avg: "$score" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          totalScore: 1,
          avgScore: { $round: ["$avgScore", 2] },
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("❌ Gagal mengambil leaderboard:", err);
    res.status(500).json({ message: "Gagal mengambil leaderboard" });
  }
};

module.exports = {
  getTotalLeaderboard,
  getLeaderboard,
};
