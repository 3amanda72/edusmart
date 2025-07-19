const express = require("express");
const router = express.Router();
const { getLeaderboard, getTotalLeaderboard } = require("../controllers/leaderboardController");
const verifyToken = require("../middleware/verifyToken");

router.get("/total", verifyToken, getTotalLeaderboard);
// Leaderboard routes
router.get("/", getLeaderboard);


module.exports = router;
