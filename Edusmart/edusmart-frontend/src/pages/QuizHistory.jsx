import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizHistory = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/quiz-results/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat kuis:", err);
      }
    };

    fetchRiwayat();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Riwayat Kuis Kamu</h2>
      {results.length === 0 ? (
        <p>Belum ada kuis yang dikerjakan.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Kategori</th>
              <th className="border px-2 py-1">Skor</th>
              <th className="border px-2 py-1">Total Soal</th>
              <th className="border px-2 py-1">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.category}</td>
                <td className="border px-2 py-1">{item.score}</td>
                <td className="border px-2 py-1">{item.totalQuestions}</td>
                <td className="border px-2 py-1">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizHistory;
