const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const BadgeProgress = require("../models/BadgeProgress");
const QuizResult = require("../models/QuizResult");
const Material = require("../models/Material");

// Konfigurasi Badge
const BADGE_CONFIG = {
  POINTS_PER_LEVEL: 100,
  LEVEL_THRESHOLDS: {
    Gold: 81,
    Silver: 61,
    Bronze: 0
  },
  MATERIAL_BADGE: {
    DEFAULT_ICON: "🏅",
    POINTS_PER_QUIZ: 5
  }
};

// Helper Functions
const calculateLevel = (points) => Math.floor(points / BADGE_CONFIG.POINTS_PER_LEVEL) + 1;

const determineBadge = (points) => {
  if (points >= BADGE_CONFIG.LEVEL_THRESHOLDS.Gold) return "Gold";
  if (points >= BADGE_CONFIG.LEVEL_THRESHOLDS.Silver) return "Silver";
  return "Bronze";
};

const ensureBadgeProgressExists = async (userId) => {
  let progress = await BadgeProgress.findOne({ userId }).populate("materialBadges.material");
  
  if (!progress) {
    progress = new BadgeProgress({ 
      userId, 
      materialBadges: [],
      completedCategories: [] 
    });
    await progress.save();
  }
  
  // Ensure arrays exist
  if (!progress.materialBadges) progress.materialBadges = [];
  if (!progress.completedCategories) progress.completedCategories = [];
  
  return progress;
};

// ✅ [GET] Get user badge progress
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📥 GET /api/badge/me called by:", userId);

    const progress = await ensureBadgeProgressExists(userId);
    const totalQuizzes = await QuizResult.countDocuments({ userId });

    // Update global badge status
    progress.level = calculateLevel(progress.totalPoints);
    await progress.save();

    const response = {
      badge: determineBadge(progress.totalPoints),
      level: progress.level,
      totalPoints: progress.totalPoints,
      totalQuizzes,
      completedCategories: progress.completedCategories.map(cat => ({
        category: cat.category,
        materialsDone: cat.materialsDone || 0,
        quizzesDone: cat.quizzesDone || 0,
        status: (cat.materialsDone > 0 && cat.quizzesDone > 0) ? "Completed" : "In Progress"
      })),
      materialBadges: progress.materialBadges.map(badge => ({
        id: badge._id,
        badgeName: badge.badgeName,
        icon: badge.icon || BADGE_CONFIG.MATERIAL_BADGE.DEFAULT_ICON,
        earnedAt: badge.earnedAt,
        materialId: badge.material?._id,
        materialTitle: badge.material?.title || "Unknown Material",
        points: badge.points || 0,
        level: badge.level || 1,
        nextLevelPoints: ((badge.level || 1) * BADGE_CONFIG.POINTS_PER_LEVEL) - (badge.points || 0)
      }))
    };

    res.json(response);
  } catch (err) {
    console.error("❌ Failed to get badge progress:", err);
    res.status(500).json({ 
      message: "Failed to get badge data",
      error: err.message 
    });
  }
});

// ✅ [POST] Mark quiz as completed
// ✅ [POST] Update quiz completion and badge progress
router.post("/kuis", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, materialId, score } = req.body;
    
    // Validasi input
    if (!category || score === undefined) {
      return res.status(400).json({ message: "Kategori dan skor diperlukan" });
    }

    const pointsEarned = Math.floor(score * 10); // Konversi skor ke poin
    const progress = await ensureBadgeProgressExists(userId);

    // Update progress global
    progress.totalPoints += pointsEarned;
    progress.level = calculateLevel(progress.totalPoints);

    // Update kategori
    const categoryIndex = progress.completedCategories.findIndex(c => c.category === category);
    if (categoryIndex >= 0) {
      progress.completedCategories[categoryIndex].quizzesDone += 1;
    } else {
      progress.completedCategories.push({
        category,
        quizzesDone: 1,
        materialsDone: 0
      });
    }

    // Update badge materi jika materialId ada
    if (materialId) {
      const material = await Material.findById(materialId);
      const badgeIndex = progress.materialBadges.findIndex(
        b => b.material && b.material.toString() === materialId
      );

      if (badgeIndex >= 0) {
        // Update badge yang sudah ada
        progress.materialBadges[badgeIndex].points += pointsEarned;
        progress.materialBadges[badgeIndex].level = calculateLevel(progress.materialBadges[badgeIndex].points);
        
        // Update tipe badge jika perlu
        const newBadgeType = determineBadge(progress.materialBadges[badgeIndex].points);
        if (newBadgeType !== progress.materialBadges[badgeIndex].badgeType) {
          progress.materialBadges[badgeIndex].badgeType = newBadgeType;
          progress.materialBadges[badgeIndex].badgeName = `${newBadgeType} ${material.title}`;
          progress.materialBadges[badgeIndex].icon = BADGE_CONFIG[newBadgeType].icon;
        }
      } else if (material) {
        // Buat badge baru
        progress.materialBadges.push({
          material: materialId,
          badgeType: "Bronze",
          badgeName: `Pemula ${material.title}`,
          icon: "🥉",
          points: pointsEarned,
          level: 1,
          earnedAt: new Date()
        });
      }
    }

    await progress.save();
    
    res.json({
      success: true,
      badge: determineBadge(progress.totalPoints),
      level: progress.level,
      totalPoints: progress.totalPoints,
      totalQuizzes: await QuizResult.countDocuments({ userId }),
      materialBadges: progress.materialBadges
    });

  } catch (error) {
    console.error("❌ Gagal menyimpan hasil kuis:", error);
    res.status(500).json({ 
      success: false,
      message: "Gagal menyimpan hasil kuis",
      error: error.message 
    });
  }
});

// ✅ [POST] Mark material as completed
router.post("/materials", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, materialId } = req.body;

    const progress = await ensureBadgeProgressExists(userId);
    const material = await Material.findById(materialId);

    // Update category progress
    const categoryIndex = progress.completedCategories.findIndex(c => c.category === category);
    if (categoryIndex >= 0) {
      progress.completedCategories[categoryIndex].materialsDone += 1;
    } else {
      progress.completedCategories.push({
        category,
        materialsDone: 1,
        quizzesDone: 0
      });
    }

    // Create initial badge if materialId provided and not exists
    if (materialId) {
      const badgeExists = progress.materialBadges.some(
        b => b.material && b.material._id.toString() === materialId.toString()
      );

      if (!badgeExists && material) {
        progress.materialBadges.push({
          material: materialId,
          badgeName: `Beginner ${material.title}`,
          icon: "📘",
          points: 0,
          level: 1,
          earnedAt: new Date()
        });
      }
    }

    await progress.save();
    res.json({ 
      success: true,
      message: "Material marked as completed"
    });
  } catch (err) {
    console.error("❌ Failed to mark material as completed:", err);
    res.status(500).json({ 
      message: "Failed to update material progress",
      error: err.message 
    });
  }
});

// ✅ [POST] Add/update material badge
// ✅ [POST] Add/update material badge
router.post("/material-badges", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { materialId, badgeName, icon, points, level } = req.body;

    // Validate required fields
    if (!materialId) {
      return res.status(400).json({ message: "Material ID is required" });
    }

    const progress = await ensureBadgeProgressExists(userId);
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Find existing badge
    const badgeIndex = progress.materialBadges.findIndex(
      b => b.material && b.material.toString() === materialId.toString()
    );

    // Prepare badge data
    const badgeData = {
      material: materialId,
      badgeName: badgeName || `Achievement: ${material.title}`,
      icon: icon || BADGE_CONFIG.MATERIAL_BADGE.DEFAULT_ICON,
      points: points || 0,
      level: level || 1,
      earnedAt: new Date(),
      lastUpdated: new Date()
    };

    // Update or create badge
    if (badgeIndex >= 0) {
      // Merge existing data with updates
      progress.materialBadges[badgeIndex] = { 
        ...progress.materialBadges[badgeIndex],
        ...badgeData 
      };
    } else {
      // Add new badge
      progress.materialBadges.push(badgeData);
    }

    // Save changes
    await progress.save();

    // Return success response
    res.status(200).json({ 
      success: true,
      message: "Material badge updated successfully",
      badge: badgeData,
      nextLevelPoints: BADGE_CONFIG.POINTS_PER_LEVEL - (badgeData.points % BADGE_CONFIG.POINTS_PER_LEVEL)
    });

  } catch (err) {
    console.error("❌ Failed to update material badge:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to update material badge",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// ✅ [POST] Add alias endpoint for compatibility
router.post("/material-badge", auth, async (req, res) => {
  // Forward to the main endpoint
  req.url = '/material-badges';
  return router.handle(req, res);
});

module.exports = router;