// src/components/MaterialCard.jsx
import React from "react";

const MaterialCard = ({ title, type, src, onComplete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {type === "pdf" ? (
        <iframe src={src} className="w-full h-64 mb-2" title={title} />
      ) : type === "video" ? (
        <iframe
          src={src}
          title={title}
          className="w-full h-64 mb-2"
          allowFullScreen
        />
      ) : (
        <p>Type tidak didukung</p>
      )}
      <button
        onClick={onComplete}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Tandai Selesai
      </button>
    </div>
  );
};

export default MaterialCard;
