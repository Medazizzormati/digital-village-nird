# Migration Node.js → Spring Boot

Ce document décrit la migration du backend Node.js/Express vers Spring Boot.

## Changements principaux

### Base de données
- **Avant**: MongoDB avec Mongoose
- **Après**: PostgreSQL avec JPA/Hibernate

### Structure
- **Avant**: `backend/src/` (Node.js)
- **Après**: `backend-spring/src/main/java/` (Spring Boot)

### Endpoints API
Les endpoints REST restent identiques pour maintenir la compatibilité avec le frontend :
- `/api/auth/*` - Authentification
- `/api/progress/*` - Progression
- `/api/teacher/*` - Gestion des classes
- `/api/admin/*` - Administration

## Variables d'environnement

### Node.js (ancien)
```env
MONGO_URI=mongodb://...
JWT_SECRET=...
PORT=5000
FRONTEND_URL=...
```

### Spring Boot (nouveau)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nird_db
DB_USER=postgres
DB_PASSWORD=...
JWT_SECRET=...
PORT=5000
FRONTEND_URL=...
SPRING_PROFILES_ACTIVE=prod
```

## Déploiement

### Render
1. Créer une base PostgreSQL sur Render
2. Créer un Web Service Java
3. Configurer les variables d'environnement
4. Le build command : `mvn clean package -DskipTests`
5. Le start command : `java -jar target/digital-village-api-1.0.0.jar`

## Migration des données (optionnel)

Si vous avez des données MongoDB existantes, vous devrez :
1. Exporter les données MongoDB en JSON
2. Créer un script de migration pour convertir vers PostgreSQL
3. Importer dans PostgreSQL

