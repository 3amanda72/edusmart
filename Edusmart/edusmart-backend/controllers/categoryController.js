const Category = require("../models/Category");

// [GET] Total Kategori
const getTotalCategories = async (req, res) => {
  try {
    const count = await Category.countDocuments();
    res.status(200).json({ success: true, total: count });
  } catch (err) {
    console.error("❌ Gagal menghitung kategori:", err);
    res.status(500).json({ success: false, message: "Gagal menghitung kategori" });
  }
};

// [GET] Ambil semua kategori
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error("❌ Gagal mengambil kategori:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil kategori" });
  }
};

// [POST] Tambah kategori baru
const createCategory = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama kategori tidak boleh kosong" });
    }

    name = name.trim();

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Kategori sudah ada" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: newCategory,
    });
  } catch (err) {
    console.error("❌ Gagal menambahkan kategori:", err);
    res.status(500).json({ success: false, message: "Gagal menambahkan kategori" });
  }
};

// [PUT] Update kategori
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama kategori tidak boleh kosong" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Kategori diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Gagal memperbarui kategori:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui kategori" });
  }
};

// [DELETE] Hapus kategori
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Kategori dihapus",
      data: deleted,
    });
  } catch (err) {
    console.error("❌ Gagal menghapus kategori:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus kategori" });
  }
};

module.exports = {
  getTotalCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
