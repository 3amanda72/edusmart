// components/QuizForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizForm = ({ materiId, fetchQuizzes, editingQuiz, setEditingQuiz }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingQuiz) {
      setQuestion(editingQuiz.question);
      setOptions(editingQuiz.options);
      setCorrectAnswer(editingQuiz.correctAnswer);
    }
  }, [editingQuiz]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      options,
      correctAnswer,
      materi: materiId,
    };

    try {
      if (editingQuiz) {
        await axios.put(`http://localhost:5000/api/quizzes/${editingQuiz._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/quizzes`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error("❌ Gagal simpan kuis:", err);
    }
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
      <input
        type="text"
        placeholder="Pertanyaan"
        className="w-full p-2 border rounded"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Opsi ${idx + 1}`}
          className="w-full p-2 border rounded"
          value={opt}
          onChange={(e) => handleOptionChange(e.target.value, idx)}
          required
        />
      ))}
      <input
        type="text"
        placeholder="Jawaban Benar"
        className="w-full p-2 border rounded"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {editingQuiz ? "Update Kuis" : "Tambah Kuis"}
      </button>
    </form>
  );
};

export default QuizForm;
