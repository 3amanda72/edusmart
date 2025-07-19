const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Material = require("./models/Material");
const Category = require("./models/Category");

// 1. Data kategori
const categoryData = [
  { name: "Matematika" },
  { name: "IPS" }
];

// 2. Data user
const userData = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Guru",
    email: "guru@example.com",
    password: "guru123",
    role: "guru"
  },
  {
    name: "Siswa",
    email: "siswa@example.com",
    password: "siswa123",
    role: "siswa"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Kosongkan koleksi lama
    await Category.deleteMany();
    await Material.deleteMany();
    await User.deleteMany();
    await Quiz.deleteMany();

    // 3. Insert kategori
    const insertedCategories = await Category.insertMany(categoryData);
    const mathCat = insertedCategories.find(c => c.name === "Matematika");
    const ipsCat = insertedCategories.find(c => c.name === "IPS");

    // 4. Insert materi
    const insertedMaterials = await Material.insertMany([
      {
        title: "Penjumlahan Dasar",
        content: "Penjumlahan adalah operasi dasar dalam matematika...",
        type: "text",
        category: mathCat._id
      },
      {
        title: "Pengantar Geografi",
        content: "Geografi mempelajari tentang bumi, manusia, dan lingkungan...",
        type: "text",
        category: ipsCat._id
      }
    ]);

    const mathMaterial = insertedMaterials.find(m => m.title.includes("Penjumlahan"));
    const ipsMaterial = insertedMaterials.find(m => m.title.includes("Geografi"));

    // 5. Insert user dengan password ter-enkripsi
    const insertedUsers = [];

    for (const user of userData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = new User({ ...user, password: hashedPassword });
      await newUser.save();
      insertedUsers.push(newUser);
    }

    const guruUser = insertedUsers.find(u => u.role === "guru");

    // 6. Insert quiz terhubung ke materi & user (guru)
    await Quiz.insertMany([
      {
        question: "Berapakah 2 + 2?",
        options: ["3", "4", "5"],
        correctAnswer: "4",
        materi: mathMaterial._id,
        createdBy: guruUser._id
      },
      {
        question: "Ibukota Indonesia?",
        options: ["Jakarta", "Bandung", "Surabaya"],
        correctAnswer: "Jakarta",
        materi: ipsMaterial._id,
        createdBy: guruUser._id
      }
    ]);

    console.log("✅ Semua data berhasil dimasukkan!");
    process.exit();
  } catch (err) {
    console.error("❌ Error saat seeding:", err.message);
    process.exit(1);
  }
};

seedData();
