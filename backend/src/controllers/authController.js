const { validationResult } = require('express-validator');
const User = require('../models/User');
const { ROLES } = require('../models/User');

// @desc    Inscription
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role, roleData } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Déterminer le rôle (empêcher la création d'admin via inscription publique)
    let userRole = role || ROLES.PUBLIC;
    if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userRole)) {
      userRole = ROLES.PUBLIC; // Downgrade silencieux
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      roleData: roleData || {},
      xp: 100, // Bonus d'inscription
      badges: [{
        badgeId: 'newcomer',
        name: 'Nouveau Membre',
        description: 'Bienvenue dans la communauté NIRD!',
        rarity: 'common'
      }]
    });

    // Enregistrer la connexion
    await user.recordLogin();

    sendTokenResponse(user, 201, res, 'Inscription réussie! Bienvenue dans NIRD!');
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez un administrateur.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Enregistrer la connexion et mettre à jour le streak
    await user.recordLogin();

    sendTokenResponse(user, 200, res, 'Connexion réussie!');
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Déconnexion
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
    data: {}
  });
};

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, preferences, roleData } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    
    // Mise à jour des données de rôle (seulement les champs autorisés)
    if (roleData) {
      const allowedRoleData = {};
      
      switch (user.role) {
        case ROLES.STUDENT:
          if (roleData.student) {
            allowedRoleData.student = {
              grade: roleData.student.grade,
              school: roleData.student.school
            };
          }
          break;
        case ROLES.TEACHER:
          if (roleData.teacher) {
            allowedRoleData.teacher = {
              subject: roleData.teacher.subject,
              school: roleData.teacher.school
            };
          }
          break;
        case ROLES.DIRECTOR:
          if (roleData.director) {
            allowedRoleData.director = roleData.director;
          }
          break;
      }
      
      user.roleData = { ...user.roleData, ...allowedRoleData };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour',
      data: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le mot de passe actuel et le nouveau'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Mot de passe mis à jour');
  } catch (error) {
    console.error('Erreur updatePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les informations de rôle
// @route   GET /api/auth/role-info
// @access  Private
exports.getRoleInfo = async (req, res) => {
  try {
    const { ROLES, PERMISSIONS } = require('../models/User');

    res.status(200).json({
      success: true,
      data: {
        currentRole: req.user.role,
        permissions: req.user.permissions,
        allRoles: Object.values(ROLES).filter(r => ![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(r)),
        roleDescriptions: {
          [ROLES.STUDENT]: {
            name: 'Étudiant / Lycéen',
            description: 'Apprenez NIRD, passez des quiz et gagnez des badges',
            emoji: '🎓'
          },
          [ROLES.TEACHER]: {
            name: 'Enseignant / Formateur',
            description: 'Créez des classes, suivez la progression des élèves',
            emoji: '👨‍🏫'
          },
          [ROLES.DIRECTOR]: {
            name: 'Direction / Administratif',
            description: 'Gérez votre établissement et consultez les statistiques',
            emoji: '🏫'
          },
          [ROLES.PUBLIC]: {
            name: 'Grand Public',
            description: 'Découvrez NIRD et testez vos connaissances',
            emoji: '👥'
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur getRoleInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ============ HELPERS ============

// Formater la réponse utilisateur
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: user.permissions,
  avatar: user.avatar,
  bio: user.bio,
  roleData: user.roleData,
  xp: user.xp,
  level: user.level,
  badges: user.badges,
  completedSteps: user.completedSteps,
  quizScores: user.quizScores,
  stats: user.stats,
  streak: user.streak,
  preferences: user.preferences,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

// Envoyer la réponse avec token
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: formatUserResponse(user)
  });
};
