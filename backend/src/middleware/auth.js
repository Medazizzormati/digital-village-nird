const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../models/User');

// Protéger les routes - Vérification du token JWT
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

// Autoriser certains rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle "${req.user.role}" n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};

// Vérifier une permission spécifique
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission "${permission}" requise`
      });
    }
    next();
  };
};

// Middleware pour les admins uniquement
exports.adminOnly = (req, res, next) => {
  if (!req.user.hasRole(ROLES.ADMIN, ROLES.SUPER_ADMIN)) {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs'
    });
  }
  next();
};

// Middleware pour les enseignants et supérieurs
exports.teacherAndAbove = (req, res, next) => {
  if (!req.user.hasRole(ROLES.TEACHER, ROLES.DIRECTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN)) {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux enseignants et administrateurs'
    });
  }
  next();
};

// Middleware pour les directeurs et supérieurs
exports.directorAndAbove = (req, res, next) => {
  if (!req.user.hasRole(ROLES.DIRECTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN)) {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux directeurs et administrateurs'
    });
  }
  next();
};

// Middleware optionnel - Ajoute l'utilisateur si connecté
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Token invalide, mais on continue sans utilisateur
    }
  }

  next();
};
