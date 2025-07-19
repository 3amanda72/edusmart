const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
