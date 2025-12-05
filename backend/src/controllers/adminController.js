const User = require('../models/User');
const Class = require('../models/Class');
const { ROLES } = require('../models/User');

// ============ GESTION DES UTILISATEURS ============

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      role, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Filtrer par rôle
    if (role && Object.values(ROLES).includes(role)) {
      query.role = role;
    }

    // Recherche par nom ou email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir un utilisateur par ID
// @route   GET /api/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Mettre à jour un utilisateur
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, roleData } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher de modifier un super_admin sauf par un super_admin
    if (user.role === ROLES.SUPER_ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas modifier un Super Admin'
      });
    }

    // Mise à jour des champs
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && Object.values(ROLES).includes(role)) {
      // Seul un super_admin peut créer un autre admin/super_admin
      if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role) && req.user.role !== ROLES.SUPER_ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Seul un Super Admin peut attribuer ce rôle'
        });
      }
      user.role = role;
    }
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (roleData) user.roleData = { ...user.roleData, ...roleData };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour',
      data: user
    });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/admin/users/:id
// @access  Super Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher de supprimer un super_admin
    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Impossible de supprimer un Super Admin'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé'
    });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Changer le rôle d'un utilisateur
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Restrictions de changement de rôle
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role) && req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Seul un Super Admin peut attribuer ce rôle'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Rôle changé en "${role}"`,
      data: { id: user._id, role: user.role, permissions: user.permissions }
    });
  } catch (error) {
    console.error('Erreur changeUserRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ============ STATISTIQUES ============

// @desc    Obtenir les statistiques globales
// @route   GET /api/admin/stats
// @access  Admin
exports.getGlobalStats = async (req, res) => {
  try {
    // Comptage par rôle
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Statistiques générales
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalClasses = await Class.countDocuments();

    // XP et progression
    const xpStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: '$xp' },
          avgXP: { $avg: '$xp' },
          maxXP: { $max: '$xp' },
          avgLevel: { $avg: '$level' }
        }
      }
    ]);

    // Progression moyenne
    const progressStats = await User.aggregate([
      {
        $project: {
          completedCount: { $size: '$completedSteps' }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletion: { $avg: '$completedCount' },
          totalCompleted: { $sum: '$completedCount' }
        }
      }
    ]);

    // Utilisateurs récents (7 derniers jours)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Quiz stats
    const quizStats = await User.aggregate([
      { $unwind: '$quizScores' },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          avgScore: {
            $avg: {
              $multiply: [
                { $divide: ['$quizScores.score', '$quizScores.totalQuestions'] },
                100
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          recent: recentUsers,
          byRole: roleStats.reduce((acc, r) => {
            acc[r._id] = r.count;
            return acc;
          }, {})
        },
        classes: {
          total: totalClasses
        },
        gamification: {
          totalXP: xpStats[0]?.totalXP || 0,
          avgXP: Math.round(xpStats[0]?.avgXP || 0),
          maxXP: xpStats[0]?.maxXP || 0,
          avgLevel: Math.round(xpStats[0]?.avgLevel || 1)
        },
        progress: {
          avgCompletion: Math.round((progressStats[0]?.avgCompletion || 0) * 20), // en %
          totalStepsCompleted: progressStats[0]?.totalCompleted || 0
        },
        quizzes: {
          total: quizStats[0]?.totalQuizzes || 0,
          avgScore: Math.round(quizStats[0]?.avgScore || 0)
        }
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

// @desc    Obtenir l'activité récente
// @route   GET /api/admin/activity
// @access  Admin
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Derniers utilisateurs inscrits
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Derniers quiz complétés
    const recentQuizzes = await User.aggregate([
      { $unwind: '$quizScores' },
      { $sort: { 'quizScores.completedAt': -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          name: 1,
          stage: '$quizScores.stage',
          score: '$quizScores.score',
          totalQuestions: '$quizScores.totalQuestions',
          completedAt: '$quizScores.completedAt'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentUsers,
        recentQuizzes
      }
    });
  } catch (error) {
    console.error('Erreur getRecentActivity:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les rôles disponibles
// @route   GET /api/admin/roles
// @access  Admin
exports.getRoles = async (req, res) => {
  try {
    const { ROLES, PERMISSIONS } = require('../models/User');

    const roles = Object.entries(ROLES).map(([key, value]) => ({
      id: value,
      name: key,
      permissions: PERMISSIONS[value] || []
    }));

    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Erreur getRoles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

