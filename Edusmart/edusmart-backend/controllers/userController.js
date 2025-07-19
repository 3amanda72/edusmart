const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Ambil data user login berdasarkan token
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Error mengambil data user login:", err);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};


const getTotalUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ total: count });
    } catch (err) {
        console.error('❌ Error fetching total users:', err);
        res.status(500).json({ message: 'Gagal mengambil total user' });
    }
}


// [GET] Ambil semua user
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).json({ message: 'Gagal mengambil data user' });
    }
    }
// [GET] Ambil user berdasarkan ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json(user);
    } catch (err) {
        console.error('❌ Error fetching user:', err);
        res.status(500).json({ message: 'Gagal mengambil data user' });
    }
}
// [POST] Buat user baru
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi sederhana
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek duplikat email
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    console.error("Error createUser:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
// [PUT] Update user
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Update fields
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json({ message: '✅ User berhasil diupdate!' });
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ message: 'Gagal mengupdate user' });
    }
}
// [DELETE] Hapus user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json({ message: '✅ User berhasil dihapus!' });
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        res.status(500).json({ message: 'Gagal menghapus user' });
    }
}
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getTotalUsers,
    getCurrentUser
};