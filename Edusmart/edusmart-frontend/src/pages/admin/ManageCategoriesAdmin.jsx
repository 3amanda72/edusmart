import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import MaterialModal from "../../components/MaterialModal";

const ManageCategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data || res.data); // fallback jika tidak ada `data`
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaterialModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCategoryId(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Kelola Semua Kategori (BAB)</h1>

        {loading ? (
          <p>Memuat data...</p>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama BAB</th>
                  <th className="p-3">Kelola Materi</th>
                  <th className="p-3">Kelola Kuis</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{cat.name}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleOpenMaterialModal(cat._id)}
                        className="text-sm text-blue-600 underline"
                      >
                        Materi
                      </button>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/manage-quizzes/${cat._id}`}
                        className="text-purple-600 hover:underline"
                      >
                        ➤ Kuis
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal Kelola Materi */}
            <MaterialModal
              categoryId={selectedCategoryId}
              isOpen={showModal}
              onClose={handleCloseModal}
            />
          </div>
        ) : (
          <p className="text-gray-600">Belum ada kategori tersedia.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageCategoriesAdmin;
