const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Bisa HTML, teks, atau link
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "pdf", "video", "ppt", "link"],
    default: "text",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Pastikan ada model Category juga
    required: true,
  },
});

module.exports = mongoose.model("Material", MaterialSchema);
