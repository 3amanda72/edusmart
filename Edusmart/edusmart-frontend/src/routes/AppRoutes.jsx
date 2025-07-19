// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";

// 🔐 Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/auth/Unauthorized";
import Default from "../pages/DefaultDashboard";

// 👥 Dashboards
import DashboardStudent from "../pages/siswa/DashboardStudent";
import DashboardGuru from "../pages/guru/DashboardGuru";
import DashboardAdmin from "../pages/admin/DashboardAdmin";

// 🧑‍🏫 Guru/Admin Management
import ManageQuiz from "../pages/ManageQuiz";
import ManageCategories from "../pages/ManageCategory";
import ManageMaterials from "../pages/ManageMaterials";
import SelectMaterialForQuiz from "../pages/SelectMaterialForQuiz"; // ✅ Tambahan

// 🛡️ Admin-only
import ManageCategoriesAdmin from "../pages/admin/ManageCategoriesAdmin";
import ManageUsers from "../pages/admin/ManageUsers";
import LeaderboardAdmin from "../pages/admin/LeaderBoardAdmin";

// 📘 Siswa Features
import QuizList from "../pages/siswa/QuizList";
import Quiz from "../pages/siswa/Quiz";
import QuizHistory from "../pages/QuizHistory";
import Leaderboard from "../pages/siswa/Leaderboard";
import MaterialsPage from "../pages/siswa/MaterialsPage";
import CategoryMaterialsPage from "../pages/siswa/CategoryMaterialsPage";
import MaterialsContent from "../pages/siswa/MaterialsContent";
import Badges from "../pages/siswa/Badges";
import Profile from "../pages/siswa/Profile";

// 🔁 Redirector
import NavigateToFirstCategory from "../pages/NavigateToFirstCategory";

const AppRoutes = () => (
  <Routes>
    {/* 🌐 Public */}
    <Route path="/" element={<Default />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* 🛡️ Admin */}
    <Route path="/admin" element={
      <RequireAuth allowedRoles={["admin"]}>
        <DashboardAdmin />
      </RequireAuth>
    } />
    <Route path="/admin/manage-categories" element={
      <RequireAuth allowedRoles={["admin"]}>
        <ManageCategoriesAdmin />
      </RequireAuth>
    } />
    <Route path="/admin/manage-users" element={
      <RequireAuth allowedRoles={["admin"]}>
        <ManageUsers />
      </RequireAuth>
    } />
    <Route path="/admin/leaderboard" element={
      <RequireAuth allowedRoles={["admin"]}>
        <LeaderboardAdmin />
      </RequireAuth>
    } />

    {/* 👨‍🏫 Guru/Admin */}
    <Route path="/guru" element={
      <RequireAuth allowedRoles={["guru"]}>
        <DashboardGuru />
      </RequireAuth>
    } />
    <Route path="/manage-categories" element={
      <RequireAuth allowedRoles={["admin", "guru"]}>
        <ManageCategories />
      </RequireAuth>
    } />
    <Route path="/manage-materials" element={
      <RequireAuth allowedRoles={["admin", "guru"]}>
        <NavigateToFirstCategory />
      </RequireAuth>
    } />
    <Route path="/manage-materials/:categoryId" element={
      <RequireAuth allowedRoles={["admin", "guru"]}>
        <ManageMaterials />
      </RequireAuth>
    } />
    <Route path="/manage-quiz" element={
      <RequireAuth allowedRoles={["admin", "guru"]}>
        <SelectMaterialForQuiz />
      </RequireAuth>
    } />
    <Route path="/manage-quiz/:materiId" element={
      <RequireAuth allowedRoles={["admin", "guru"]}>
        <ManageQuiz />
      </RequireAuth>
    } />

    {/* 👩‍🎓 Siswa */}
    <Route path="/dashboard" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <DashboardStudent />
      </RequireAuth>
    } />
    <Route path="/quiz" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Quiz />
      </RequireAuth>
    } />
    <Route path="/quiz-list" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <QuizList />
      </RequireAuth>
    } />
    <Route path="/q-history" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <QuizHistory />
      </RequireAuth>
    } />
    <Route path="/leaderboard" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Leaderboard />
      </RequireAuth>
    } />
    <Route path="/badges" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Badges />
      </RequireAuth>
    } />
    <Route path="/profile" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Profile />
      </RequireAuth>
    } />

    {/* 📚 Materi */}
    <Route path="/materials" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <MaterialsPage />
      </RequireAuth>
    } />
    <Route path="/materials/:categoryId" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <CategoryMaterialsPage />
      </RequireAuth>
    } />
    <Route path="/materials/:categoryId/materi/:materiId" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <MaterialsContent />
      </RequireAuth>
    } />
    <Route path="/materials/:categoryId/materi/:materiId/quiz" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Quiz />
      </RequireAuth>
    } />
    <Route path="/materials/:categoryId/quiz" element={
      <RequireAuth allowedRoles={["siswa"]}>
        <Quiz />
      </RequireAuth>
    } />
  </Routes>
);

export default AppRoutes;

console.log("🛣️ Routing dimuat");
