const express = require('express');
const router = express.Router();

const {
  createClass,
  getMyClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
  getStudentProgress,
  joinClassByCode,
  exportClassData
} = require('../controllers/teacherController');

const { protect, teacherAndAbove, checkPermission } = require('../middleware/auth');

// Route publique pour rejoindre une classe (étudiants)
router.post('/classes/join', protect, joinClassByCode);

// Routes protégées pour enseignants
router.use(protect);

// Gestion des classes
router.post('/classes', teacherAndAbove, checkPermission('create_class'), createClass);
router.get('/classes', teacherAndAbove, getMyClasses);
router.get('/classes/:id', teacherAndAbove, getClassById);
router.put('/classes/:id', teacherAndAbove, updateClass);
router.delete('/classes/:id', teacherAndAbove, deleteClass);

// Gestion des étudiants dans les classes
router.post('/classes/:id/students', teacherAndAbove, checkPermission('manage_students'), addStudentToClass);
router.delete('/classes/:id/students/:studentId', teacherAndAbove, checkPermission('manage_students'), removeStudentFromClass);

// Progression des étudiants
router.get('/students/:id/progress', teacherAndAbove, checkPermission('view_student_progress'), getStudentProgress);

// Export de données
router.get('/classes/:id/export', teacherAndAbove, checkPermission('export_reports'), exportClassData);

module.exports = router;

