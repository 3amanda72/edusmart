// models/UserProgress.js
const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
