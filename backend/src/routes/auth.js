const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
  getRoleInfo
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .optional()
    .isIn(['student', 'teacher', 'director', 'public'])
    .withMessage('Rôle invalide')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Routes protégées
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.get('/role-info', protect, getRoleInfo);

module.exports = router;
