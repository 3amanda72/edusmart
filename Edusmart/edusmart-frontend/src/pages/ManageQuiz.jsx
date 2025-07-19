// pages/ManageQuiz.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuizForm from "../components/QuizForm";

const ManageQuizzes = () => {
  const { materiId: materialId } = useParams(); // ✅ Ambil materiId dari URL dan beri alias ke materialId
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [materiTitle, setMateriTitle] = useState("");
  const token = localStorage.getItem("token");

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/materi/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data?.data || res.data || []);
    } catch (err) {
      console.error("❌ Gagal ambil kuis:", err);
    }
  };

  const fetchMateriTitle = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMateriTitle(res.data?.data?.title || res.data?.title || "Judul tidak ditemukan");
    } catch (err) {
      console.error("❌ Gagal ambil judul materi:", err);
      setMateriTitle("❌ Gagal memuat judul");
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchQuizzes();
      fetchMateriTitle();
    }
  }, [materialId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizzes();
    } catch (err) {
      console.error("❌ Gagal hapus kuis:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kelola Kuis: {materiTitle}</h1>
      <QuizForm
        materiId={materialId}
        fetchQuizzes={fetchQuizzes}
        editingQuiz={editingQuiz}
        setEditingQuiz={setEditingQuiz}
      />
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Pertanyaan</th>
            <th className="border px-2 py-1">Jawaban Benar</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, idx) => (
            <tr key={quiz._id}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{quiz.question}</td>
              <td className="border px-2 py-1">{quiz.correctAnswer}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => setEditingQuiz(quiz)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuizzes;
