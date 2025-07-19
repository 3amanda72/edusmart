import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import './index.css'; // atau './tailwind.css' tergantung nama file kamu


function App() {
  console.log("📦 App.jsx dimuat");
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
