const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données (optionnel - mode démo si non disponible)
connectDB().then(connected => {
  if (!connected) {
    console.log('🎮 Backend en mode DEMO - utilisez le frontend en mode démo également');
  }
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============ ROUTES ============

// Auth - Authentification
app.use('/api/auth', require('./routes/auth'));

// Progress - Progression utilisateur
app.use('/api/progress', require('./routes/progress'));

// Teacher - Gestion des classes (enseignants)
app.use('/api/teacher', require('./routes/teacher'));

// Admin - Administration
app.use('/api/admin', require('./routes/admin'));

// ============ ROUTES D'INFO ============

// Route principale - Documentation API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Digital Village API - NIRD Backend',
    version: '2.0.0',
    documentation: {
      auth: {
        'POST /api/auth/register': 'Inscription (public)',
        'POST /api/auth/login': 'Connexion (public)',
        'GET /api/auth/me': 'Profil utilisateur (auth)',
        'POST /api/auth/logout': 'Déconnexion (auth)',
        'PUT /api/auth/updateprofile': 'Modifier profil (auth)',
        'PUT /api/auth/updatepassword': 'Changer mot de passe (auth)',
        'GET /api/auth/role-info': 'Infos sur les rôles (auth)'
      },
      progress: {
        'GET /api/progress': 'Obtenir progression (auth)',
        'POST /api/progress/step/:stepId': 'Compléter étape (auth)',
        'DELETE /api/progress/step/:stepId': 'Annuler étape (auth)',
        'POST /api/progress/quiz': 'Sauvegarder quiz (auth)',
        'GET /api/progress/leaderboard': 'Classement (public)',
        'GET /api/progress/stats': 'Stats globales (public)'
      },
      teacher: {
        'POST /api/teacher/classes': 'Créer classe (teacher)',
        'GET /api/teacher/classes': 'Mes classes (teacher)',
        'GET /api/teacher/classes/:id': 'Détails classe (teacher)',
        'PUT /api/teacher/classes/:id': 'Modifier classe (teacher)',
        'DELETE /api/teacher/classes/:id': 'Supprimer classe (teacher)',
        'POST /api/teacher/classes/:id/students': 'Ajouter élève (teacher)',
        'DELETE /api/teacher/classes/:id/students/:studentId': 'Retirer élève (teacher)',
        'GET /api/teacher/students/:id/progress': 'Progression élève (teacher)',
        'POST /api/teacher/classes/join': 'Rejoindre classe (student)',
        'GET /api/teacher/classes/:id/export': 'Exporter données (teacher)'
      },
      admin: {
        'GET /api/admin/users': 'Liste utilisateurs (admin)',
        'GET /api/admin/users/:id': 'Détails utilisateur (admin)',
        'PUT /api/admin/users/:id': 'Modifier utilisateur (admin)',
        'PUT /api/admin/users/:id/role': 'Changer rôle (admin)',
        'DELETE /api/admin/users/:id': 'Supprimer utilisateur (super_admin)',
        'GET /api/admin/stats': 'Statistiques globales (admin)',
        'GET /api/admin/activity': 'Activité récente (admin)',
        'GET /api/admin/roles': 'Liste des rôles (admin)'
      }
    },
    roles: {
      student: '🎓 Étudiants / Lycéens',
      teacher: '👨‍🏫 Enseignants / Formateurs',
      director: '🏫 Direction / Administratifs',
      public: '👥 Grand Public',
      admin: '⚙️ Administrateurs',
      super_admin: '🛡️ Super Admin'
    }
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============ GESTION DES ERREURS ============

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  
  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: messages
    });
  }

  // Erreur de duplication (email unique)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette valeur existe déjà'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
});

// ============ DÉMARRAGE ============

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 Digital Village API - NIRD Backend v2.0             ║
║                                                          ║
║   Server: http://localhost:${PORT}                          ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(12)}                    ║
║                                                          ║
║   📚 Endpoints:                                          ║
║   ├── Auth:     /api/auth                                ║
║   ├── Progress: /api/progress                            ║
║   ├── Teacher:  /api/teacher                             ║
║   └── Admin:    /api/admin                               ║
║                                                          ║
║   👥 Rôles disponibles:                                  ║
║   ├── 🎓 student   - Étudiants / Lycéens                 ║
║   ├── 👨‍🏫 teacher   - Enseignants / Formateurs            ║
║   ├── 🏫 director  - Direction / Administratifs          ║
║   ├── 👥 public    - Grand Public                        ║
║   ├── ⚙️  admin     - Administrateurs                     ║
║   └── 🛡️  super_admin - Super Admin                       ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
