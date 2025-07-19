console.log("✅ authMiddleware loaded");

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded; // => bisa akses req.user.id
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
