const BadgeProgress = require("../models/BadgeProgress");
const QuizResult = require("../models/QuizResult");
const Material = require("../models/Material");

// Konfigurasi Level dan Badge
const BADGE_CONFIG = {
  GLOBAL: {
    Bronze: { minPoints: 0, icon: "🥉" },
    Silver: { minPoints: 50, icon: "🥈" },
    Gold: { minPoints: 100, icon: "🥇" }
  },
  MATERIAL: {
    Bronze: { minPoints: 0, icon: "📘", namePrefix: "Pemula" },
    Silver: { minPoints: 30, icon: "📗", namePrefix: "Ahli" },
    Gold: { minPoints: 70, icon: "📙", namePrefix: "Master" }
  },
  POINTS_PER_LEVEL: 50
};

// Helper
const calculateLevel = (points) => Math.floor(points / BADGE_CONFIG.POINTS_PER_LEVEL) + 1;

const determineBadgeType = (points, config) => {
  if (points >= config.Gold.minPoints) return "Gold";
  if (points >= config.Silver.minPoints) return "Silver";
  return "Bronze";
};

// ✅ Tambahan untuk alias global badge
const determineBadge = (points) => determineBadgeType(points, BADGE_CONFIG.GLOBAL);

const getBadgeInfo = (type, config, materialTitle = "") => {
  const data = config[type];
  return {
    badgeType: type,
    badgeName: materialTitle ? `${data.namePrefix} ${materialTitle}` : type,
    icon: data.icon,
    minPoints: data.minPoints
  };
};

// GET Badge Progress
const getBadgeProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    let progress = await BadgeProgress.findOne({ userId }).populate("materialBadges.material", "title");

    if (!progress) {
      progress = await BadgeProgress.create({
        userId,
        totalPoints: 0,
        globalBadge: "Bronze",
        level: 1,
        materialBadges: [],
        completedCategories: []
      });
    }

    progress.level = calculateLevel(progress.totalPoints);
    progress.globalBadge = determineBadgeType(progress.totalPoints, BADGE_CONFIG.GLOBAL);
    await progress.save();

    const totalQuizzes = await QuizResult.countDocuments({ userId });

    const response = {
      globalBadge: getBadgeInfo(progress.globalBadge, BADGE_CONFIG.GLOBAL),
      level: progress.level,
      totalPoints: progress.totalPoints,
      totalQuizzes,
      categories: progress.completedCategories.map(cat => ({
        name: cat.category,
        materialsDone: cat.materialsDone || 0,
        quizzesDone: cat.quizzesDone || 0,
        status: (cat.materialsDone > 0 && cat.quizzesDone > 0) ? "Completed" : "In Progress"
      })),
      materialBadges: progress.materialBadges.map(badge => {
        const badgeInfo = getBadgeInfo(badge.badgeType, BADGE_CONFIG.MATERIAL, badge.material?.title);
        return {
          materialId: badge.material?._id,
          materialTitle: badge.material?.title || "Unknown",
          ...badgeInfo,
          points: badge.points,
          level: badge.level,
          earnedAt: badge.earnedAt,
          nextLevel: {
            requiredPoints: ((badge.level + 1) * BADGE_CONFIG.POINTS_PER_LEVEL) - badge.points,
            targetLevel: badge.level + 1
          }
        };
      })
    };

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching badge progress:", error);
    res.status(500).json({ message: "Gagal mengambil progres badge" });
  }
};

// POST Record Material Completion
const recordMaterialCompletion = async (req, res) => {
  try {
    const { category, materialId } = req.body;
    const userId = req.user.id;

    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ message: "Materi tidak ditemukan" });

    let progress = await BadgeProgress.findOne({ userId });
    if (!progress) {
      progress = await BadgeProgress.create({ userId, materialBadges: [], completedCategories: [] });
    }

    const categoryData = progress.completedCategories.find(c => c.category === category);
    if (categoryData) {
      categoryData.materialsDone += 1;
      categoryData.lastUpdated = new Date();
    } else {
      progress.completedCategories.push({
        category,
        materialsDone: 1,
        quizzesDone: 0,
        lastUpdated: new Date()
      });
    }

    const existingBadge = progress.materialBadges.find(b => b.material.toString() === materialId);
    if (!existingBadge) {
      progress.materialBadges.push({
        material: materialId,
        badgeType: "Bronze",
        badgeName: `Pemula ${material.title}`,
        icon: BADGE_CONFIG.MATERIAL.Bronze.icon,
        points: 0,
        level: 1,
        earnedAt: new Date()
      });
    }

    await progress.save();
    res.json({ message: "✅ Material completion recorded" });
  } catch (error) {
    console.error("❌ Error recording material completion:", error);
    res.status(500).json({ message: "Gagal mencatat penyelesaian materi" });
  }
};

// POST Record Quiz Completion
const recordQuizCompletion = async (req, res) => {
  try {
    const { category, materialId, score } = req.body;
    const userId = req.user.id;
    const pointsEarned = Math.floor(score * 10);

    let progress = await BadgeProgress.findOne({ userId });
    if (!progress) {
      progress = await BadgeProgress.create({ userId, materialBadges: [], completedCategories: [] });
    }

    // Global update
    progress.totalPoints += pointsEarned;

    // Update kategori
    const categoryData = progress.completedCategories.find(c => c.category === category);
    if (categoryData) {
      categoryData.quizzesDone += 1;
      categoryData.lastUpdated = new Date();
    } else {
      progress.completedCategories.push({
        category,
        quizzesDone: 1,
        materialsDone: 0,
        lastUpdated: new Date()
      });
    }

    // Update badge per materi
    if (materialId) {
      let badge = progress.materialBadges.find(b => b.material.toString() === materialId);
      if (badge) {
        badge.points += pointsEarned;
        badge.level = calculateLevel(badge.points);

        const newType = determineBadgeType(badge.points, BADGE_CONFIG.MATERIAL);
        if (newType !== badge.badgeType) {
          const material = await Material.findById(materialId);
          Object.assign(badge, getBadgeInfo(newType, BADGE_CONFIG.MATERIAL, material.title), {
            earnedAt: new Date()
          });
        }

        badge.lastUpdated = new Date();
      } else {
        const material = await Material.findById(materialId);
        progress.materialBadges.push({
          material: materialId,
          ...getBadgeInfo("Bronze", BADGE_CONFIG.MATERIAL, material.title),
          points: pointsEarned,
          level: calculateLevel(pointsEarned),
          earnedAt: new Date()
        });
      }
    }

    await progress.save();
    res.json({ message: "✅ Quiz completion recorded", pointsEarned });
  } catch (error) {
    console.error("❌ Error recording quiz:", error);
    res.status(500).json({ message: "Gagal mencatat kuis" });
  }
};
// Tambahkan fungsi ini sebelum bagian module.exports
const giveMaterialBadge = (points, materialTitle) => {
  const badgeType = determineBadgeType(points, BADGE_CONFIG.MATERIAL);
  return getBadgeInfo(badgeType, BADGE_CONFIG.MATERIAL, materialTitle);
};

// Kemudian tambahkan ke module.exports
module.exports = {
  getBadgeProgress,
  recordMaterialCompletion,
  recordQuizCompletion,
  calculateLevel,
  determineBadgeType,
  determineBadge,
  getBadgeInfo,
  giveMaterialBadge // ✅ Tambahkan ini
};
