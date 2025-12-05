# 🚀 Digital Village NIRD - Backend API v2.0

Backend Node.js/Express complet avec système de rôles, gestion des classes et gamification.

## 📋 Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

## 🛠️ Installation

```bash
cd backend
npm install
npm run dev
```

## 👥 Système de Rôles

### 1. 🎓 Étudiants / Lycéens (`student`)
**Permissions:**
- Consulter le contenu NIRD
- Passer des quiz
- Suivre sa progression
- Gagner des badges et XP
- Rejoindre des classes avec un code

### 2. 👨‍🏫 Enseignants / Formateurs (`teacher`)
**Permissions:** (tout ce que student peut faire, plus)
- Créer et gérer des classes
- Ajouter/retirer des étudiants
- Voir la progression des élèves
- Créer des quiz personnalisés
- Exporter des rapports

### 3. 🏫 Responsables d'Établissements (`director`)
**Permissions:** (tout ce que teacher peut faire, plus)
- Voir toutes les progressions de l'établissement
- Consulter les statistiques globales
- Gérer les enseignants
- Voir les analytics

### 4. 👥 Grand Public (`public`)
**Permissions:**
- Consulter le contenu
- Passer des quiz
- Suivre sa progression personnelle
- Gagner des badges

### 5. ⚙️ Administrateurs (`admin`)
**Permissions:**
- Gérer tous les utilisateurs
- Modérer le contenu
- Voir toutes les statistiques
- Gérer les quiz et badges

### 6. 🛡️ Super Admin (`super_admin`)
**Permissions:**
- Toutes les permissions
- Créer/supprimer des admins
- Accès complet au système

## 📚 API Endpoints

### 🔐 Authentification (`/api/auth`)

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/register` | Inscription | Public |
| POST | `/login` | Connexion | Public |
| GET | `/me` | Profil utilisateur | Auth |
| PUT | `/updateprofile` | Modifier profil | Auth |
| PUT | `/updatepassword` | Changer mot de passe | Auth |
| GET | `/role-info` | Infos sur les rôles | Auth |

### 📊 Progression (`/api/progress`)

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/` | Ma progression | Auth |
| POST | `/step/:stepId` | Compléter une étape | Auth |
| DELETE | `/step/:stepId` | Annuler une étape | Auth |
| POST | `/quiz` | Sauvegarder score quiz | Auth |
| GET | `/leaderboard` | Classement | Public |
| GET | `/stats` | Stats globales | Public |

### 👨‍🏫 Enseignants (`/api/teacher`)

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/classes` | Créer une classe | Teacher |
| GET | `/classes` | Mes classes | Teacher |
| GET | `/classes/:id` | Détails classe | Teacher |
| PUT | `/classes/:id` | Modifier classe | Teacher |
| DELETE | `/classes/:id` | Supprimer classe | Teacher |
| POST | `/classes/:id/students` | Ajouter élève | Teacher |
| DELETE | `/classes/:id/students/:studentId` | Retirer élève | Teacher |
| GET | `/students/:id/progress` | Progression élève | Teacher |
| POST | `/classes/join` | Rejoindre classe (code) | Student |
| GET | `/classes/:id/export` | Exporter données | Teacher |

### ⚙️ Administration (`/api/admin`)

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/users` | Liste utilisateurs | Admin |
| GET | `/users/:id` | Détails utilisateur | Admin |
| PUT | `/users/:id` | Modifier utilisateur | Admin |
| PUT | `/users/:id/role` | Changer rôle | Admin |
| DELETE | `/users/:id` | Supprimer utilisateur | Super Admin |
| GET | `/stats` | Statistiques globales | Admin |
| GET | `/activity` | Activité récente | Admin |
| GET | `/roles` | Liste des rôles | Admin |

## 🎮 Système de Gamification

### XP et Niveaux
| Action | XP Gagné |
|--------|----------|
| Inscription | +100 XP |
| Compléter une étape | +200 XP |
| Quiz (par question correcte) | +10 × stage XP |
| Bonus parfait (100%) | +100 XP |
| Bonus excellent (>80%) | +50 XP |
| Rejoindre une classe | +50 XP |

**1 niveau = 500 XP**

### Badges
| Badge | Condition | Rareté |
|-------|-----------|--------|
| 🆕 Newcomer | Inscription | Common |
| 🚀 Pioneer | 1ère étape | Common |
| 🗺️ Explorer | 3 étapes | Rare |
| 👑 Master | 5 étapes | Legendary |
| 🛡️ Secure | Étape sécurité | Epic |
| 🌍 Eco-Warrior | Étape durabilité | Rare |
| 🧠 Quiz Master | Tous quiz >80% | Epic |

### Streak
- Connexion quotidienne = +1 streak
- Meilleur streak enregistré
- Réinitialisation après 1 jour d'inactivité

## 📝 Exemples de Requêtes

### Inscription Enseignant
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Dupont",
    "email": "marie@lycee.fr",
    "password": "password123",
    "role": "teacher",
    "roleData": {
      "teacher": {
        "subject": "SNT",
        "school": "Lycée Victor Hugo"
      }
    }
  }'
```

### Créer une Classe
```bash
curl -X POST http://localhost:5000/api/teacher/classes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Terminale NSI - Groupe 1",
    "grade": "Terminale",
    "subject": "NSI",
    "establishment": "Lycée Victor Hugo"
  }'
```

### Rejoindre une Classe (Étudiant)
```bash
curl -X POST http://localhost:5000/api/teacher/classes/join \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "code": "ABC123" }'
```

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Connexion MongoDB
│   ├── controllers/
│   │   ├── authController.js  # Auth + profil
│   │   ├── progressController.js
│   │   ├── teacherController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js            # JWT + permissions
│   ├── models/
│   │   ├── User.js            # Utilisateur + rôles
│   │   └── Class.js           # Classes
│   ├── routes/
│   │   ├── auth.js
│   │   ├── progress.js
│   │   ├── teacher.js
│   │   └── admin.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## 🔒 Sécurité

- Mots de passe hashés (bcrypt, salt 10)
- JWT avec expiration 7 jours
- Validation express-validator
- Permissions par rôle
- Protection des routes admin
- CORS configuré

## 🚀 Déploiement

```bash
# Variables d'environnement requises
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_tres_long
JWT_EXPIRE=7d
FRONTEND_URL=https://votre-frontend.com
```

## 📄 Licence

MIT - Nuit de l'Info 2025 - Digital Village NIRD
