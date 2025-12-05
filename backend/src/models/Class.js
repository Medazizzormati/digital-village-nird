const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la classe est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  code: {
    type: String,
    unique: true,
    uppercase: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  establishment: {
    type: String,
    required: true
  },
  grade: {
    type: String, // ex: "Terminale", "1ère", "2nde"
    required: true
  },
  subject: {
    type: String // ex: "Informatique", "SNT"
  },
  academicYear: {
    type: String, // ex: "2024-2025"
    required: true
  },
  // Statistiques de la classe
  stats: {
    avgProgress: { type: Number, default: 0 },
    avgXP: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    avgQuizScore: { type: Number, default: 0 }
  },
  // Objectifs de la classe
  goals: [{
    stepId: Number,
    deadline: Date,
    completed: { type: Boolean, default: false }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Générer un code unique pour la classe
ClassSchema.pre('save', async function(next) {
  if (!this.code) {
    this.code = generateClassCode();
  }
  this.updatedAt = Date.now();
  next();
});

// Générer un code aléatoire de 6 caractères
function generateClassCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Calculer les statistiques de la classe
ClassSchema.methods.calculateStats = async function() {
  const User = require('./User');
  
  if (this.students.length === 0) {
    this.stats = {
      avgProgress: 0,
      avgXP: 0,
      totalQuizzesTaken: 0,
      avgQuizScore: 0
    };
    return this.stats;
  }

  const students = await User.find({ _id: { $in: this.students } });
  
  let totalProgress = 0;
  let totalXP = 0;
  let totalQuizzes = 0;
  let totalQuizScore = 0;
  let quizCount = 0;

  students.forEach(student => {
    totalProgress += (student.completedSteps.length / 5) * 100;
    totalXP += student.xp;
    totalQuizzes += student.stats.totalQuizzesTaken;
    
    student.quizScores.forEach(quiz => {
      totalQuizScore += (quiz.score / quiz.totalQuestions) * 100;
      quizCount++;
    });
  });

  this.stats = {
    avgProgress: Math.round(totalProgress / students.length),
    avgXP: Math.round(totalXP / students.length),
    totalQuizzesTaken: totalQuizzes,
    avgQuizScore: quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0
  };

  await this.save();
  return this.stats;
};

module.exports = mongoose.model('Class', ClassSchema);

