import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialForm from "../components/MaterialForm";
import { useParams, Link, useNavigate } from "react-router-dom";

const ManageMaterials = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Ambil kategori
        const res = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || res.data || [];
        setCategories(data);

        if (!categoryId && data.length > 0) {
          // Redirect ke kategori pertama
          navigate(`/manage-materials/${data[0]._id}`, { replace: true });
        } else if (categoryId) {
          await fetchMaterialsByCategory(categoryId);
        }
      } catch (err) {
        console.error("❌ Gagal mengambil kategori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, token, navigate]);

  const fetchMaterialsByCategory = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/materials/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const materialData = res.data?.data || res.data || [];
      setMaterials(materialData);
    } catch (err) {
      console.error("❌ Gagal mengambil materi berdasarkan kategori:", err);
      setMaterials([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchMaterialsByCategory(categoryId);
    } catch (err) {
      console.error("❌ Gagal menghapus materi:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Materi</h1>

      <MaterialForm
        fetchMaterials={() => fetchMaterialsByCategory(categoryId)}
        editing={editing}
        setEditing={setEditing}
        categories={categories}
      />

      {loading ? (
        <p className="mt-4 text-gray-500">⏳ Memuat data materi...</p>
      ) : materials.length === 0 ? (
        <p className="mt-4 text-gray-500">Belum ada materi untuk kategori ini.</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Judul</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat._id}>
                <td className="border p-2">{mat.title}</td>
                <td className="border p-2">{mat.category?.name || "-"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => setEditing(mat)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mat._id)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                  <Link
                    to={`/manage-quiz/${mat._id}`}
                    className="text-green-600 underline"
                  >
                    Kelola Kuis
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageMaterials;
