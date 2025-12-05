const User = require('../models/User');

// @desc    Obtenir la progression de l'utilisateur
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        completedSteps: user.completedSteps,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        quizScores: user.quizScores,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Erreur getProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Compléter une étape NIRD
// @route   POST /api/progress/step/:stepId
// @access  Private
exports.completeStep = async (req, res) => {
  try {
    const stepId = parseInt(req.params.stepId);
    const user = await User.findById(req.user.id);

    // Vérifier si l'étape est valide (1-5)
    if (stepId < 1 || stepId > 5) {
      return res.status(400).json({
        success: false,
        message: 'Étape invalide'
      });
    }

    // Vérifier si l'étape n'est pas déjà complétée
    if (user.completedSteps.includes(stepId)) {
      return res.status(400).json({
        success: false,
        message: 'Cette étape est déjà complétée'
      });
    }

    // Ajouter l'étape et l'XP
    user.completedSteps.push(stepId);
    const xpGained = 200;
    await user.addXP(xpGained);

    // Vérifier les badges à débloquer
    const newBadges = [];
    
    if (user.completedSteps.length === 1 && !user.badges.find(b => b.badgeId === 'pioneer')) {
      user.badges.push({ badgeId: 'pioneer' });
      newBadges.push('pioneer');
    }
    
    if (user.completedSteps.length >= 3 && !user.badges.find(b => b.badgeId === 'explorer')) {
      user.badges.push({ badgeId: 'explorer' });
      newBadges.push('explorer');
    }
    
    if (user.completedSteps.length === 5 && !user.badges.find(b => b.badgeId === 'master')) {
      user.badges.push({ badgeId: 'master' });
      newBadges.push('master');
    }

    // Badge spécifique à l'étape sécurité
    if (stepId === 4 && !user.badges.find(b => b.badgeId === 'secure')) {
      user.badges.push({ badgeId: 'secure' });
      newBadges.push('secure');
    }

    // Badge spécifique à l'étape durabilité
    if (stepId === 5 && !user.badges.find(b => b.badgeId === 'eco-warrior')) {
      user.badges.push({ badgeId: 'eco-warrior' });
      newBadges.push('eco-warrior');
    }

    // Mettre à jour le streak
    await user.updateStreak();
    await user.save();

    res.status(200).json({
      success: true,
      message: `Étape ${stepId} complétée! +${xpGained} XP`,
      data: {
        completedSteps: user.completedSteps,
        xp: user.xp,
        level: user.level,
        xpGained,
        newBadges,
        badges: user.badges,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Erreur completeStep:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Annuler une étape NIRD
// @route   DELETE /api/progress/step/:stepId
// @access  Private
exports.uncompleteStep = async (req, res) => {
  try {
    const stepId = parseInt(req.params.stepId);
    const user = await User.findById(req.user.id);

    // Vérifier si l'étape est complétée
    if (!user.completedSteps.includes(stepId)) {
      return res.status(400).json({
        success: false,
        message: 'Cette étape n\'est pas complétée'
      });
    }

    // Retirer l'étape
    user.completedSteps = user.completedSteps.filter(id => id !== stepId);
    user.xp = Math.max(0, user.xp - 200);
    user.calculateLevel();
    await user.save();

    res.status(200).json({
      success: true,
      message: `Étape ${stepId} retirée`,
      data: {
        completedSteps: user.completedSteps,
        xp: user.xp,
        level: user.level
      }
    });
  } catch (error) {
    console.error('Erreur uncompleteStep:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Sauvegarder un score de quiz
// @route   POST /api/progress/quiz
// @access  Private
exports.saveQuizScore = async (req, res) => {
  try {
    const { stage, score, totalQuestions } = req.body;
    const user = await User.findById(req.user.id);

    // Ajouter le score
    user.quizScores.push({
      stage,
      score,
      totalQuestions
    });

    // Calculer XP bonus basé sur le score
    const percentage = (score / totalQuestions) * 100;
    let xpGained = stage * 10 * score; // XP de base
    
    if (percentage === 100) {
      xpGained += 100; // Bonus parfait
    } else if (percentage >= 80) {
      xpGained += 50; // Bonus excellent
    }

    await user.addXP(xpGained);

    // Badge Quiz Master si tous les stages complétés avec >80%
    const allStagesCompleted = [1, 2, 3, 4, 5].every(s => {
      const stageScores = user.quizScores.filter(qs => qs.stage === s);
      return stageScores.some(qs => (qs.score / qs.totalQuestions) >= 0.8);
    });

    let newBadge = null;
    if (allStagesCompleted && !user.badges.find(b => b.badgeId === 'quiz-master')) {
      user.badges.push({ badgeId: 'quiz-master' });
      newBadge = 'quiz-master';
    }

    await user.updateStreak();
    await user.save();

    res.status(200).json({
      success: true,
      message: `Quiz stage ${stage} sauvegardé! +${xpGained} XP`,
      data: {
        quizScores: user.quizScores,
        xp: user.xp,
        level: user.level,
        xpGained,
        newBadge,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Erreur saveQuizScore:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir le classement
// @route   GET /api/progress/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .select('name role xp level badges completedSteps')
      .sort({ xp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        role: user.role,
        xp: user.xp,
        level: user.level,
        badgeCount: user.badges.length,
        completedSteps: user.completedSteps.length
      }))
    });
  } catch (error) {
    console.error('Erreur getLeaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les statistiques globales
// @route   GET /api/progress/stats
// @access  Public
exports.getGlobalStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalXP = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$xp' } } }
    ]);
    const avgCompletion = await User.aggregate([
      { $project: { completedCount: { $size: '$completedSteps' } } },
      { $group: { _id: null, avg: { $avg: '$completedCount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalXP: totalXP[0]?.total || 0,
        avgCompletion: Math.round((avgCompletion[0]?.avg || 0) * 20), // En pourcentage
        totalSteps: 5
      }
    });
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

