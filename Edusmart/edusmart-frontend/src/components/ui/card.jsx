import React from "react";
import { useNavigate } from "react-router-dom";

// Gaya warna berdasarkan kategori
const categoryColors = {
  matematika: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", button: "bg-blue-600 hover:bg-blue-700" },
  fisika: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", button: "bg-purple-600 hover:bg-purple-700" },
  kimia: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", button: "bg-green-600 hover:bg-green-700" },
  biologi: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", button: "bg-emerald-600 hover:bg-emerald-700" },
  default: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", button: "bg-gray-600 hover:bg-gray-700" },
};

// Dapatkan gaya kategori
const getCategoryStyle = (categoryName) => {
  if (!categoryName) return categoryColors.default;
  const lower = categoryName.toLowerCase();
  if (lower.includes("matematika")) return categoryColors.matematika;
  if (lower.includes("fisika")) return categoryColors.fisika;
  if (lower.includes("kimia")) return categoryColors.kimia;
  if (lower.includes("biologi")) return categoryColors.biologi;
  return categoryColors.default;
};

// Komponen Card
const Card = ({ materi, showRetake = false, onRetake }) => {
  const navigate = useNavigate();
  const categoryStyle = getCategoryStyle(materi?.category?.name);

  const goToMaterial = () => {
    const categoryParam = materi?.category?.name.toLowerCase() || "kategori";
    navigate(`/materi/${categoryParam}?materiId=${materi._id}`);
  };

  return (
    <div className={`border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${categoryStyle.border}`}>
      <div className={`${categoryStyle.bg} px-4 py-3`}>
        <h4 className={`font-semibold text-lg ${categoryStyle.text}`}>
          {materi.title}
        </h4>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {showRetake 
            ? "Ulangi materi ini untuk memperdalam pemahamanmu." 
            : materi.description}
        </p>
        <button
          onClick={showRetake ? onRetake : goToMaterial}
          className={`w-full ${showRetake ? "bg-blue-600 hover:bg-blue-700" : categoryStyle.button} text-white py-2 rounded-md text-sm font-medium transition`}
        >
          {showRetake ? "Ulangi Kuis Ini" : "Pelajari Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default Card;
