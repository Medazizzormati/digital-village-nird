const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Définition des rôles et leurs permissions
const ROLES = {
  STUDENT: 'student',           // Étudiants / Lycéens
  TEACHER: 'teacher',           // Enseignants / Formateurs
  DIRECTOR: 'director',         // Responsables d'Établissements
  PUBLIC: 'public',             // Grand Public Curieux
  ADMIN: 'admin',               // Administrateurs du site
  SUPER_ADMIN: 'super_admin'    // Super Admin technique
};

const PERMISSIONS = {
  // Étudiants
  [ROLES.STUDENT]: [
    'view_content',
    'take_quiz',
    'track_progress',
    'view_leaderboard',
    'earn_badges',
    'view_resources'
  ],
  // Enseignants
  [ROLES.TEACHER]: [
    'view_content',
    'take_quiz',
    'track_progress',
    'view_leaderboard',
    'earn_badges',
    'view_resources',
    'create_class',
    'manage_students',
    'view_student_progress',
    'create_custom_quiz',
    'export_reports'
  ],
  // Directeurs
  [ROLES.DIRECTOR]: [
    'view_content',
    'take_quiz',
    'track_progress',
    'view_leaderboard',
    'earn_badges',
    'view_resources',
    'view_all_progress',
    'view_statistics',
    'manage_teachers',
    'manage_establishment',
    'export_reports',
    'view_analytics'
  ],
  // Grand Public
  [ROLES.PUBLIC]: [
    'view_content',
    'take_quiz',
    'track_progress',
    'view_leaderboard',
    'earn_badges',
    'view_resources'
  ],
  // Administrateurs
  [ROLES.ADMIN]: [
    'view_content',
    'take_quiz',
    'track_progress',
    'view_leaderboard',
    'earn_badges',
    'view_resources',
    'manage_users',
    'manage_content',
    'view_all_statistics',
    'manage_quizzes',
    'manage_badges',
    'moderate_content'
  ],
  // Super Admin
  [ROLES.SUPER_ADMIN]: [
    '*' // Toutes les permissions
  ]
};

const UserSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir un email valide'
    ]
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  
  // Rôle et permissions
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.PUBLIC
  },
  permissions: [{
    type: String
  }],
  
  // Profil étendu
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
  },
  
  // Informations spécifiques au rôle
  roleData: {
    // Pour les étudiants
    student: {
      grade: String,           // Niveau scolaire
      school: String,          // Établissement
      classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }
    },
    // Pour les enseignants
    teacher: {
      subject: String,         // Matière enseignée
      school: String,          // Établissement
      classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
    },
    // Pour les directeurs
    director: {
      establishment: String,   // Nom de l'établissement
      establishmentType: {
        type: String,
        enum: ['college', 'lycee', 'university', 'other']
      },
      region: String
    },
    // Pour les admins
    admin: {
      department: String,
      accessLevel: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
      }
    }
  },
  
  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary']
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Progression NIRD
  completedSteps: [{
    type: Number
  }],
  
  // Quiz scores
  quizScores: [{
    stage: Number,
    score: Number,
    totalQuestions: Number,
    timeSpent: Number, // en secondes
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistiques d'utilisation
  stats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // en minutes
    loginCount: { type: Number, default: 0 },
    lastLogin: Date
  },
  
  // Streak
  streak: {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  
  // Préférences
  preferences: {
    language: { type: String, default: 'fr' },
    theme: { type: String, default: 'dark' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  
  // Statut du compte
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Dates
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les recherches
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ xp: -1 });
UserSchema.index({ 'roleData.student.school': 1 });
UserSchema.index({ 'roleData.teacher.school': 1 });

// Hasher le mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  // Définir les permissions selon le rôle
  if (this.isModified('role')) {
    this.permissions = PERMISSIONS[this.role] || PERMISSIONS[ROLES.PUBLIC];
  }
  
  if (!this.isModified('password')) {
    this.updatedAt = Date.now();
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
  next();
});

// Comparer les mots de passe
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer JWT Token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      permissions: this.permissions 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Vérifier si l'utilisateur a une permission
UserSchema.methods.hasPermission = function(permission) {
  if (this.permissions.includes('*')) return true;
  return this.permissions.includes(permission);
};

// Vérifier si l'utilisateur a un des rôles
UserSchema.methods.hasRole = function(...roles) {
  return roles.includes(this.role);
};

// Calculer le niveau basé sur XP
UserSchema.methods.calculateLevel = function() {
  const xpPerLevel = 500;
  this.level = Math.floor(this.xp / xpPerLevel) + 1;
  return this.level;
};

// Ajouter XP
UserSchema.methods.addXP = async function(amount, reason = '') {
  this.xp += amount;
  this.calculateLevel();
  this.updatedAt = Date.now();
  await this.save();
  return { xp: this.xp, level: this.level, gained: amount, reason };
};

// Mettre à jour le streak
UserSchema.methods.updateStreak = async function() {
  const now = new Date();
  const lastActivity = new Date(this.streak.lastActivity);
  const diffDays = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return this.streak;
  } else if (diffDays === 1) {
    this.streak.current += 1;
    if (this.streak.current > this.streak.best) {
      this.streak.best = this.streak.current;
    }
  } else {
    this.streak.current = 1;
  }

  this.streak.lastActivity = now;
  await this.save();
  return this.streak;
};

// Enregistrer une connexion
UserSchema.methods.recordLogin = async function() {
  this.stats.loginCount += 1;
  this.stats.lastLogin = new Date();
  await this.updateStreak();
  await this.save();
};

// Méthode statique pour obtenir les permissions d'un rôle
UserSchema.statics.getRolePermissions = function(role) {
  return PERMISSIONS[role] || [];
};

// Méthode statique pour obtenir tous les rôles
UserSchema.statics.getAllRoles = function() {
  return ROLES;
};

module.exports = mongoose.model('User', UserSchema);
module.exports.ROLES = ROLES;
module.exports.PERMISSIONS = PERMISSIONS;
