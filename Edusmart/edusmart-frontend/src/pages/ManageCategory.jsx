import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryForm from "../components/CategoryForm";
import { Link } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.data)) {
        setCategories(res.data.data); // ✅ ambil data array dari res.data.data
        setError("");
      } else {
        setCategories([]);
        setError("Format data kategori tidak valid.");
      }
    } catch (err) {
      console.error("❌ Gagal memuat kategori:", err);
      setError("Gagal memuat kategori dari server.");
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("❌ Gagal menghapus kategori:", err);
      setError("Gagal menghapus kategori.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Kategori (BAB)</h1>

      <CategoryForm
        fetchCategories={fetchCategories}
        editing={editing}
        setEditing={setEditing}
      />

      {error && (
        <div className="text-red-600 bg-red-100 p-3 my-3 rounded">
          ⚠️ {error}
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span className="font-medium">{cat.name}</span>
            <Link
              to={`/manage-materials/${cat._id}`}
              className="text-green-600 underline"
            >
              Kelola Materi
            </Link>
            <div className="space-x-2">
              <button
                onClick={() => setEditing(cat)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
