# Digital Village NIRD - Backend Spring Boot

Backend API pour la plateforme Digital Village NIRD, développé avec Spring Boot 3.2 et PostgreSQL.

## 🚀 Technologies

- **Spring Boot 3.2.0**
- **PostgreSQL** (base de données)
- **Spring Security** (authentification JWT)
- **Spring Data JPA** (ORM)
- **Maven** (gestion des dépendances)

## 📋 Prérequis

- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## 🔧 Installation locale

1. **Cloner le projet**
```bash
cd backend-spring
```

2. **Configurer PostgreSQL**
   - Créer une base de données : `nird_db`
   - Créer un utilisateur avec les permissions nécessaires

3. **Configurer les variables d'environnement**
   - Copier `.env.example` vers `.env` (si disponible)
   - Ou configurer dans `application.properties` :
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/nird_db
     spring.datasource.username=postgres
     spring.datasource.password=votre_mot_de_passe
     jwt.secret=votre_secret_jwt_securise
     ```

4. **Compiler et lancer**
```bash
mvn clean install
mvn spring-boot:run
```

Le serveur démarre sur `http://localhost:5000`

## 🌐 Déploiement sur Render

### 1. Créer une base de données PostgreSQL
- Dans Render Dashboard, créer une nouvelle **PostgreSQL Database**
- Noter les informations de connexion

### 2. Créer un Web Service
- **Type**: Web Service
- **Name**: `digital-village-api-spring`
- **Environment**: Java
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/digital-village-api-1.0.0.jar`

### 3. Variables d'environnement
```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<généré automatiquement ou défini manuellement>
DB_HOST=<host de votre base PostgreSQL>
DB_PORT=5432
DB_NAME=nird_db
DB_USER=<utilisateur PostgreSQL>
DB_PASSWORD=<mot de passe PostgreSQL>
FRONTEND_URL=https://digital-village-nird.vercel.app
```

### 4. Déployer
- Connecter votre dépôt GitHub
- Render déploiera automatiquement

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur (auth)
- `POST /api/auth/logout` - Déconnexion

### Progression
- `GET /api/progress` - Obtenir progression (auth)
- `POST /api/progress/step/:stepId` - Compléter étape (auth)
- `POST /api/progress/quiz` - Sauvegarder quiz (auth)
- `GET /api/progress/leaderboard` - Classement (public)
- `GET /api/progress/stats` - Stats globales (public)

### Enseignants
- `POST /api/teacher/classes` - Créer classe (teacher)
- `GET /api/teacher/classes` - Mes classes (teacher)
- `GET /api/teacher/classes/:id` - Détails classe (teacher)

### Administration
- `GET /api/admin/users` - Liste utilisateurs (admin)
- `GET /api/admin/stats` - Statistiques (admin)

## 🔐 Rôles

- **STUDENT** - Étudiants / Lycéens
- **TEACHER** - Enseignants / Formateurs
- **DIRECTOR** - Direction / Administratifs
- **PUBLIC** - Grand Public
- **ADMIN** - Administrateurs
- **SUPER_ADMIN** - Super Admin

## 📝 Notes

- Le backend utilise JWT pour l'authentification
- Les mots de passe sont hashés avec BCrypt
- La base de données est créée automatiquement au premier démarrage (ddl-auto=update)

