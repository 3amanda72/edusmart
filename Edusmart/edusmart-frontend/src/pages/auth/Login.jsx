import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      alert("✅ Login berhasil!");

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "guru") navigate("/guru");
      else navigate("/dashboard");
    } catch (err) {
      alert("❌ Login gagal: " + err.response?.data?.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden">
      {/* Awan Animasi */}
      <div className="absolute w-full h-full z-0 overflow-hidden">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
        <div className="cloud cloud6"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-4xl w-full mx-4 shadow-xl rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Ilustrasi */}
        <div className="hidden md:flex items-center justify-center bg-sky-100 p-10">
          <img
            src="../assets/images/edusmart-ilustrasi.png"
            alt="Ilustrasi"
            className="w-full max-w-xs"
          />
        </div>

        {/* Login Form */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center">
            Masuk ke <span className="text-sky-500">EduSmart</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md font-medium transition"
            >
              Masuk
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Belum punya akun? Hubungi admin Edusmart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
