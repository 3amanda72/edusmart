import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryForm = ({ fetchCategories, editing, setEditing }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Set nilai input saat mode edit
  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
    } else {
      setName("");
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setError("");

    if (!name.trim()) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editing) {
        await axios.put(
          `http://localhost:5000/api/categories/${editing._id}`,
          { name },
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/categories",
          { name },
          config
        );
      }

      setName("");
      setEditing(null);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan kategori";
      setError(msg);
      console.error("❌ Gagal simpan kategori:", msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="Nama kategori (BAB)"
        className="border px-3 py-2 rounded w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {editing ? "Update" : "Tambah"}
      </button>
      {editing && (
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setName("");
          }}
          className="text-gray-600 hover:text-red-500"
        >
          Batal
        </button>
      )}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
};

export default CategoryForm;
