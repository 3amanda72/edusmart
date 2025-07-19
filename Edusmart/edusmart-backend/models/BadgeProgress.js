// models/BadgeProgress.js
const mongoose = require("mongoose");

const materialBadgeSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
  badgeName: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

const categoryProgressSchema = new mongoose.Schema({
  category: String,
  materialsDone: { type: Number, default: 0 },
  quizzesDone: { type: Number, default: 0 },
});

const badgeProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badge: { type: String, default: "Bronze" },
  completedCategories: [categoryProgressSchema],
  materialBadges: [materialBadgeSchema],
});

module.exports = mongoose.model("BadgeProgress", badgeProgressSchema);