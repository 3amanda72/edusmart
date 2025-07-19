import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageQuizByMateri = () => {
  const { materiId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/materi/${materiId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(res.data);
    } catch (err) {
      console.error("Gagal ambil kuis:", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [materiId]);

  const handleChange = (e, idx) => {
    if (idx !== undefined) {
      const updatedOptions = [...form.options];
      updatedOptions[idx] = e.target.value;
      setForm({ ...form, options: updatedOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, materi: materiId };
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/quizzes/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`http://localhost:5000/api/quizzes`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ question: "", options: ["", "", "", ""], correctAnswer: "" });
      setEditingId(null);
      fetchQuizzes();
    } catch (err) {
      console.error("Gagal simpan kuis:", err);
    }
  };

  const handleEdit = (quiz) => {
    setForm({
      question: quiz.question,
      options: quiz.options,
      correctAnswer: quiz.correctAnswer,
    });
    setEditingId(quiz._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizzes();
    } catch (err) {
      console.error("Gagal hapus kuis:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Kelola Kuis untuk Materi Ini</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="question"
          placeholder="Pertanyaan"
          value={form.question}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {form.options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Opsi ${idx + 1}`}
            value={opt}
            onChange={(e) => handleChange(e, idx)}
            className="w-full border p-2 rounded"
            required
          />
        ))}
        <input
          type="text"
          name="correctAnswer"
          placeholder="Jawaban Benar"
          value={form.correctAnswer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Kuis" : "Tambah Kuis"}
        </button>
      </form>

      {/* List */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Pertanyaan</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, idx) => (
            <tr key={quiz._id}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{quiz.question}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => handleEdit(quiz)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(quiz._id)} className="text-red-500">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuizByMateri;
