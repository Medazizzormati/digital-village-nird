const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  getGlobalStats,
  getRecentActivity,
  getRoles
} = require('../controllers/adminController');

const { protect, adminOnly, authorize } = require('../middleware/auth');
const { ROLES } = require('../models/User');

// Toutes les routes nécessitent une authentification admin
router.use(protect);
router.use(adminOnly);

// Gestion des utilisateurs
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', authorize(ROLES.SUPER_ADMIN), deleteUser);

// Statistiques et activité
router.get('/stats', getGlobalStats);
router.get('/activity', getRecentActivity);

// Rôles et permissions
router.get('/roles', getRoles);

module.exports = router;

