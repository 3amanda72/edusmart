import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavigateToFirstCategory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categories = res.data?.data || res.data || [];
        if (categories.length > 0) {
          navigate(`/manage-materials/${categories[0]._id}`, { replace: true });
        } else {
          alert("⚠️ Belum ada kategori. Tambahkan kategori terlebih dahulu.");
        }
      } catch (err) {
        console.error("❌ Gagal mengambil kategori:", err);
        alert("Terjadi kesalahan saat memuat kategori.");
      }
    };

    fetchAndRedirect();
  }, [navigate, token]);

  return <p className="p-4 text-gray-500">🔄 Mengarahkan ke kategori pertama...</p>;
};

export default NavigateToFirstCategory;
