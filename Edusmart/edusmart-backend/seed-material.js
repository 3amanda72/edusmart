const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Material = require("./models/Material");
require("dotenv").config();

const seedMaterials = async () => {
  try {
    await connectDB();

    // Cari atau buat kategori Matematika
    let mathCategory = await Category.findOne({ name: "Matematika" });
    if (!mathCategory) {
      mathCategory = await Category.create({ name: "Matematika" });
    }

    // Cari atau buat kategori IPS
    let ipsCategory = await Category.findOne({ name: "IPS" });
    if (!ipsCategory) {
      ipsCategory = await Category.create({ name: "IPS" });
    }

    // Kosongkan data Material (opsional)
    await Material.deleteMany();

    // Tambahkan data materi
    const materials = [
      {
        title: "Aljabar",
        content: "Materi pengantar aljabar dasar: variabel, persamaan, dan penyelesaian.",
        type: "text",
        category: mathCategory._id,
      },
      {
        title: "Perbandingan",
        content: "Materi tentang rasio, skala, dan perbandingan senilai.",
        type: "text",
        category: mathCategory._id,
      },
      {
        title: "IPS",
        content: "Materi dasar IPS: geografi, sejarah, ekonomi, dan sosiologi.",
        type: "text",
        category: ipsCategory._id,
      },
    ];

    await Material.insertMany(materials);
    console.log("✅ Materi berhasil dimasukkan!");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal seeding materi:", err.message);
    process.exit(1);
  }
};

seedMaterials();
