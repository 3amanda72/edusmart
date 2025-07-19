import React, { useState } from "react";
import axios from "axios";

const ModalTambahUser = ({ onClose, onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("siswa");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users",
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ User created:", response.data);

      if (onUserAdded) onUserAdded(); // Refresh user list
      resetForm();                    // Bersihkan form
      onClose();                      // Tutup modal
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal menambahkan pengguna.";
      console.error("❌ Error creating user:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Pengguna</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama"
            className="w-full border p-2 rounded mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full border p-2 rounded mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
          </select>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                resetForm();  // Bersihkan input
                onClose();    // Tutup modal
              }}
              className="mr-2 px-4 py-2 border rounded text-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahUser;
