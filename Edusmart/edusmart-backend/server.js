require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const badgeRoutes = require("./routes/badgeRoutes");
const quizResultRoutes = require("./routes/quizResultRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const materialRoutes = require("./routes/materialRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Koneksi ke database
connectDB();

// Static file (jika ada upload)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route check
app.get("/", (req, res) => {
  res.send("✅ Edusmart API is running...");
});

// Gunakan semua routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz-results", quizResultRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badge", badgeRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
