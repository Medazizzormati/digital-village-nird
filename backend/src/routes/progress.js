const express = require('express');
const router = express.Router();

const {
  getProgress,
  completeStep,
  uncompleteStep,
  saveQuizScore,
  getLeaderboard,
  getGlobalStats
} = require('../controllers/progressController');

const { protect } = require('../middleware/auth');

// Routes publiques
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getGlobalStats);

// Routes protégées
router.get('/', protect, getProgress);
router.post('/step/:stepId', protect, completeStep);
router.delete('/step/:stepId', protect, uncompleteStep);
router.post('/quiz', protect, saveQuizScore);

module.exports = router;

