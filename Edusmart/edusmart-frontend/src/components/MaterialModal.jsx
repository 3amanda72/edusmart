// src/components/MaterialModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialForm from "./MaterialForm";
import { Link } from "react-router-dom";

const MaterialModal = ({ categoryId, isOpen, onClose }) => {
  const [materials, setMaterials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchMaterials();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);

  };

  const fetchMaterials = async () => {
    const res = await axios.get(`http://localhost:5000/api/materials/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);

  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/materials/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMaterials();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-start justify-center pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl font-bold">×</button>
        <h2 className="text-2xl font-bold mb-4">Kelola Materi</h2>

        <MaterialForm
          fetchMaterials={fetchMaterials}
          editing={editing}
          setEditing={setEditing}
          categories={categories}
          defaultCategoryId={categoryId}
        />

        <table className="w-full border mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Judul</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat._id}>
                <td className="border p-2">{mat.title}</td>
                <td className="border p-2">{mat.category?.name}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => setEditing(mat)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(mat._id)} className="text-red-500">Hapus</button>
                  <Link to={`/manage-quiz/${mat._id}`} className="text-green-600 underline">Kelola Kuis</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialModal;
