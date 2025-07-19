// models/QuizResult.js
const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  materialId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Material", 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  score: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  totalQuestions: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  isRemidial: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("QuizResult", QuizResultSchema);
