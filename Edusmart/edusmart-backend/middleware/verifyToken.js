const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ⬅️ penting!
    next();
  } catch (err) {
    console.error("Token tidak valid:", err);
    res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = verifyToken;
