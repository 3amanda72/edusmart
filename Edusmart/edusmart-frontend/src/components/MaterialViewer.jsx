import React from "react";

const MaterialViewer = ({ category }) => {
  return (
    <div className="bg-white shadow p-4 rounded">
      {/* Contoh tampil PDF/video tergantung kategori */}
      {category === "Aritmatika Sosial" && (
        <iframe src="/materials/aritmatika1.pdf" width="100%" height="500px" />
      )}

      {category === "Garis dan Sudut" && (
        <video controls width="100%">
          <source src="/materials/garisdanSudut1.mp4" type="video/mp4" />
          Browser tidak mendukung video.
        </video>
      )}
    </div>
  );
};

export default MaterialViewer;
