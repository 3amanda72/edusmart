import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MaterialForm = ({ fetchMaterials, editing, setEditing, categories }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const { categoryId } = useParams();

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setContent(editing.content);
      setType(editing.type || "text");
      setCategory(editing.category?._id || editing.category);
    } else if (categoryId) {
      setCategory(categoryId); // ambil dari URL jika bukan mode edit
    }
  }, [editing, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("category", category);

    if (type === "text" || type === "link") {
      formData.append("content", content);
    } else if (file) {
      formData.append("file", file);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editing) {
        await axios.put(`http://localhost:5000/api/materials/${editing._id}`, formData, config);
      } else {
        await axios.post("http://localhost:5000/api/materials", formData, config);
      }

      setTitle("");
      setContent("");
      setFile(null);
      setCategory(categoryId || "");
      setType("text");
      setEditing(null);
      fetchMaterials(); // refresh data materi
    } catch (err) {
      console.error("Gagal simpan materi:", err.response?.data || err);
      alert("❌ Gagal simpan materi. Cek console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
      {/* Kategori */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
        required
      >
        <option value="">Pilih Kategori</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Judul */}
      <input
        type="text"
        placeholder="Judul Materi"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        required
      />

      {/* Tipe materi */}
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setContent("");
          setFile(null);
        }}
        className="border p-2 rounded"
      >
        <option value="text">Teks</option>
        <option value="pdf">PDF</option>
        <option value="ppt">PPT</option>
        <option value="video">Video</option>
        <option value="link">Link (YouTube / Google Drive)</option>
      </select>

      {/* Konten */}
      {type === "text" || type === "link" ? (
        <textarea
          placeholder={type === "link" ? "Masukkan URL link..." : "Isi materi..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          required
        />
      ) : (
        <input
          type="file"
          accept={
            type === "pdf"
              ? ".pdf"
              : type === "ppt"
              ? ".ppt,.pptx"
              : type === "video"
              ? "video/*"
              : "*"
          }
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
          required
        />
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editing ? "Update Materi" : "Tambah Materi"}
      </button>
    </form>
  );
};

export default MaterialForm;
