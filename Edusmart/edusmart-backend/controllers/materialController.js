const mongoose = require("mongoose");
const Material = require("../models/Material");
const Category = require("../models/Category");
const UserProgress = require("../models/UserProgress");

// ✅ GET semua materi
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate("category", "name");
    res.status(200).json({ success: true, data: materials });
  } catch (err) {
    console.error("❌ Gagal mengambil semua materi:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil materi" });
  }
};

// ✅ GET materi berdasarkan ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID materi tidak valid" });
    }

    const material = await Material.findById(id).populate("category", "name");
    if (!material) {
      return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });
    }

    res.status(200).json({ success: true, data: material });
  } catch (err) {
    console.error("❌ Gagal mengambil materi:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil materi" });
  }
};

// ✅ GET materi berdasarkan kategori
const getMaterialsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "ID kategori tidak valid" });
    }

    const materials = await Material.find({ category: categoryId }).populate("category", "name");
    res.status(200).json({ success: true, data: materials });
  } catch (err) {
    console.error("❌ Gagal mengambil materi berdasarkan kategori:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil materi berdasarkan kategori" });
  }
};

// ✅ POST tambah materi
const createMaterial = async (req, res) => {
  try {
    const { title, type, content, category } = req.body;
    let finalContent = content;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "ID kategori tidak valid" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }

    if (type === "pdf") {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "File PDF wajib diunggah untuk tipe 'pdf'" });
      }
      finalContent = `/uploads/${req.file.filename}`;
    }

    const newMaterial = new Material({ title, type, content: finalContent, category });
    await newMaterial.save();

    const populatedMaterial = await newMaterial.populate("category", "name");
    res.status(201).json({ success: true, data: populatedMaterial });
  } catch (err) {
    console.error("❌ Gagal menambahkan materi:", err);
    res.status(500).json({ success: false, message: "Gagal menambahkan materi" });
  }
};

// ✅ PUT ubah materi
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, content, category } = req.body;
    let updatedContent = content;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID materi tidak valid" });
    }

    if (type === "pdf" && req.file) {
      updatedContent = `/uploads/${req.file.filename}`;
    }

    const updated = await Material.findByIdAndUpdate(
      id,
      { title, type, content: updatedContent, category },
      { new: true }
    ).populate("category", "name");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Materi tidak ditemukan untuk diperbarui" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ Gagal mengubah materi:", err);
    res.status(500).json({ success: false, message: "Gagal mengubah materi" });
  }
};

// ✅ DELETE materi
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID materi tidak valid" });
    }

    const deleted = await Material.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Materi tidak ditemukan untuk dihapus" });
    }

    res.status(200).json({ success: true, message: "Materi berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus materi:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus materi" });
  }
};

// ✅ GET total materi
const getTotalMaterials = async (req, res) => {
  try {
    const total = await Material.countDocuments();
    res.status(200).json({ success: true, total });
  } catch (err) {
    console.error("❌ Gagal mengambil total materi:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil total materi" });
  }
};

// ✅ GET materi dengan status dikunci/sudah selesai
const getMaterialsWithProgress = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "ID kategori tidak valid" });
    }

    const materials = await Material.find({ category: categoryId }).sort({ createdAt: 1 });
    const userProgress = await UserProgress.find({
      userId,
      materialId: { $in: materials.map(m => m._id) }
    });

    const completedIds = userProgress.map(p => p.materialId.toString());

    const materialsWithLock = materials.map((material, index) => {
      const isCompleted = completedIds.includes(material._id.toString());
      const isUnlocked = index === 0 || completedIds.includes(materials[index - 1]._id.toString()) || isCompleted;

      return {
        ...material.toObject(),
        isCompleted,
        isLocked: !isUnlocked,
        order: index + 1
      };
    });

    res.status(200).json({ success: true, data: materialsWithLock });
  } catch (err) {
    console.error("❌ Gagal mengambil materi + progress:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil materi dengan status" });
  }
};

// ✅ POST simpan progres pengguna
const saveUserProgress = async (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return res.status(400).json({ success: false, message: "ID materi tidak valid" });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });
    }

    const existing = await UserProgress.findOne({ userId, materialId });
    if (!existing) {
      await UserProgress.create({ userId, materialId, categoryId: material.category });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Gagal menyimpan progres:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan progress" });
  }
};

// ✅ GET progress global kategori (untuk frontend lock/unlock BAB)
const getUnlockedCategoryIndex = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find().sort({ order: 1 });
    const userProgress = await UserProgress.find({ userId }).populate('materialId');

    let unlockedIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const totalMaterials = await Material.countDocuments({ category: category._id });

      const completedMaterials = userProgress.filter(up =>
        up.materialId?.category?.toString() === category._id.toString()
      ).length;

      if (totalMaterials > 0 && completedMaterials >= totalMaterials) {
        unlockedIndex = i + 1;
      } else {
        break;
      }
    }

    if (unlockedIndex >= categories.length) unlockedIndex = categories.length - 1;

    res.status(200).json({ success: true, completedIndex: unlockedIndex });
  } catch (err) {
    console.error("❌ Gagal mengambil kategori terbuka:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil progres global kategori" });
  }
};

// ✅ GET progress kategori untuk dashboard
const getUserCategoryProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find().sort({ order: 1 });
    const userProgress = await UserProgress.find({ userId }).populate('materialId');

    const categoryProgress = await Promise.all(categories.map(async (category, index) => {
      const totalMaterials = await Material.countDocuments({ category: category._id });
      const completedMaterials = userProgress.filter(up =>
        up.materialId?.category?.toString() === category._id.toString()
      ).length;

      let isUnlocked = index === 0;
      if (!isUnlocked && index > 0) {
        const prevCategory = categories[index - 1];
        const prevMaterials = await Material.find({ category: prevCategory._id }).distinct('_id');
        const prevProgress = await UserProgress.findOne({ userId, materialId: { $in: prevMaterials } });
        isUnlocked = !!prevProgress;
      }

      return {
        categoryId: category._id,
        categoryName: category.name,
        order: category.order,
        totalMaterials,
        completedMaterials,
        isUnlocked,
        progress: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0
      };
    }));

    res.status(200).json({ success: true, data: categoryProgress });
  } catch (err) {
    console.error("❌ Gagal mengambil progress kategori:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil progress kategori" });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  getMaterialsByCategory,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getTotalMaterials,
  getMaterialsWithProgress,
  saveUserProgress,
  getUserCategoryProgress,
  getUnlockedCategoryIndex // ✅ tambahkan ke ekspor
};
