const User = require('../models/User');
const Class = require('../models/Class');
const { ROLES } = require('../models/User');

// ============ GESTION DES CLASSES ============

// @desc    Créer une nouvelle classe
// @route   POST /api/teacher/classes
// @access  Teacher
exports.createClass = async (req, res) => {
  try {
    const { name, description, grade, subject, establishment, academicYear } = req.body;

    const newClass = await Class.create({
      name,
      description,
      grade,
      subject,
      establishment: establishment || req.user.roleData?.teacher?.school,
      academicYear: academicYear || getCurrentAcademicYear(),
      teacher: req.user._id
    });

    // Ajouter la classe à l'enseignant
    if (!req.user.roleData.teacher) {
      req.user.roleData.teacher = {};
    }
    if (!req.user.roleData.teacher.classes) {
      req.user.roleData.teacher.classes = [];
    }
    req.user.roleData.teacher.classes.push(newClass._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Classe créée avec succès',
      data: newClass
    });
  } catch (error) {
    console.error('Erreur createClass:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir les classes de l'enseignant
// @route   GET /api/teacher/classes
// @access  Teacher
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id })
      .populate('students', 'name email xp level completedSteps')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    console.error('Erreur getMyClasses:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir une classe par ID
// @route   GET /api/teacher/classes/:id
// @access  Teacher
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    }).populate('students', 'name email xp level completedSteps quizScores badges streak');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Calculer les statistiques
    await classData.calculateStats();

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    console.error('Erreur getClassById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Mettre à jour une classe
// @route   PUT /api/teacher/classes/:id
// @access  Teacher
exports.updateClass = async (req, res) => {
  try {
    const { name, description, grade, subject, goals, isActive } = req.body;

    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    if (name) classData.name = name;
    if (description) classData.description = description;
    if (grade) classData.grade = grade;
    if (subject) classData.subject = subject;
    if (goals) classData.goals = goals;
    if (typeof isActive === 'boolean') classData.isActive = isActive;

    await classData.save();

    res.status(200).json({
      success: true,
      message: 'Classe mise à jour',
      data: classData
    });
  } catch (error) {
    console.error('Erreur updateClass:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Supprimer une classe
// @route   DELETE /api/teacher/classes/:id
// @access  Teacher
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Retirer la classe des étudiants
    await User.updateMany(
      { 'roleData.student.classId': classData._id },
      { $unset: { 'roleData.student.classId': '' } }
    );

    await classData.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Classe supprimée'
    });
  } catch (error) {
    console.error('Erreur deleteClass:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ============ GESTION DES ÉTUDIANTS ============

// @desc    Ajouter un étudiant à une classe (par code)
// @route   POST /api/teacher/classes/:id/students
// @access  Teacher
exports.addStudentToClass = async (req, res) => {
  try {
    const { studentEmail, studentId } = req.body;

    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Trouver l'étudiant
    let student;
    if (studentId) {
      student = await User.findById(studentId);
    } else if (studentEmail) {
      student = await User.findOne({ email: studentEmail });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Vérifier si déjà dans la classe
    if (classData.students.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'L\'étudiant est déjà dans cette classe'
      });
    }

    // Ajouter l'étudiant
    classData.students.push(student._id);
    await classData.save();

    // Mettre à jour l'étudiant
    if (!student.roleData.student) {
      student.roleData.student = {};
    }
    student.roleData.student.classId = classData._id;
    student.roleData.student.school = classData.establishment;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Étudiant ajouté à la classe',
      data: {
        classId: classData._id,
        student: {
          id: student._id,
          name: student.name,
          email: student.email
        }
      }
    });
  } catch (error) {
    console.error('Erreur addStudentToClass:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Retirer un étudiant d'une classe
// @route   DELETE /api/teacher/classes/:id/students/:studentId
// @access  Teacher
exports.removeStudentFromClass = async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Retirer l'étudiant
    classData.students = classData.students.filter(
      id => id.toString() !== req.params.studentId
    );
    await classData.save();

    // Mettre à jour l'étudiant
    await User.findByIdAndUpdate(req.params.studentId, {
      $unset: { 'roleData.student.classId': '' }
    });

    res.status(200).json({
      success: true,
      message: 'Étudiant retiré de la classe'
    });
  } catch (error) {
    console.error('Erreur removeStudentFromClass:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Obtenir la progression d'un étudiant
// @route   GET /api/teacher/students/:id/progress
// @access  Teacher
exports.getStudentProgress = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Vérifier que l'étudiant est dans une classe de l'enseignant
    const teacherClasses = await Class.find({ teacher: req.user._id });
    const isInClass = teacherClasses.some(c => 
      c.students.some(s => s.toString() === student._id.toString())
    );

    if (!isInClass && req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez voir que les étudiants de vos classes'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role
        },
        progress: {
          xp: student.xp,
          level: student.level,
          completedSteps: student.completedSteps,
          badges: student.badges,
          streak: student.streak
        },
        quizzes: student.quizScores,
        stats: student.stats
      }
    });
  } catch (error) {
    console.error('Erreur getStudentProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Rejoindre une classe avec un code
// @route   POST /api/teacher/classes/join
// @access  Student
exports.joinClassByCode = async (req, res) => {
  try {
    const { code } = req.body;

    const classData = await Class.findOne({ code: code.toUpperCase(), isActive: true });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée ou code invalide'
      });
    }

    // Vérifier si déjà dans la classe
    if (classData.students.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà dans cette classe'
      });
    }

    // Ajouter l'étudiant
    classData.students.push(req.user._id);
    await classData.save();

    // Mettre à jour l'étudiant
    if (!req.user.roleData.student) {
      req.user.roleData.student = {};
    }
    req.user.roleData.student.classId = classData._id;
    req.user.roleData.student.school = classData.establishment;
    await req.user.save();

    // XP bonus pour avoir rejoint une classe
    await req.user.addXP(50, 'Rejoint une classe');

    res.status(200).json({
      success: true,
      message: `Vous avez rejoint la classe "${classData.name}"`,
      data: {
        classId: classData._id,
        className: classData.name,
        teacher: classData.teacher,
        xpGained: 50
      }
    });
  } catch (error) {
    console.error('Erreur joinClassByCode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ============ RAPPORTS ============

// @desc    Exporter les données d'une classe
// @route   GET /api/teacher/classes/:id/export
// @access  Teacher
exports.exportClassData = async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user._id
    }).populate('students', '-password');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Classe non trouvée'
      });
    }

    // Préparer les données pour export
    const exportData = {
      class: {
        name: classData.name,
        code: classData.code,
        grade: classData.grade,
        subject: classData.subject,
        academicYear: classData.academicYear
      },
      stats: classData.stats,
      students: classData.students.map(s => ({
        name: s.name,
        email: s.email,
        xp: s.xp,
        level: s.level,
        completedSteps: s.completedSteps.length,
        totalQuizzes: s.quizScores.length,
        avgQuizScore: s.quizScores.length > 0
          ? Math.round(s.quizScores.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / s.quizScores.length)
          : 0,
        badges: s.badges.length,
        streak: s.streak.current
      })),
      exportedAt: new Date()
    };

    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Erreur exportClassData:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Helper: Obtenir l'année académique actuelle
function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  if (month >= 9) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

