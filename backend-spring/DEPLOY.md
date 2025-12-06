# Guide de déploiement - Backend Spring Boot sur Render

## 📋 Prérequis

1. Compte Render (gratuit disponible)
2. Compte GitHub avec le code source
3. PostgreSQL (gratuit sur Render)

## 🚀 Étapes de déploiement

### 1. Créer la base de données PostgreSQL

1. Dans Render Dashboard, cliquez sur **"New +"** → **"PostgreSQL"**
2. Configurez :
   - **Name**: `nird-postgres`
   - **Database**: `nird_db`
   - **User**: `nird_user`
   - **Region**: Frankfurt (EU)
   - **Plan**: Free
3. Notez les informations de connexion (affichées après création)

### 2. Créer le Web Service

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Sélectionnez le dépôt `digital-village-nird`
4. Configurez :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `digital-village-api-spring` |
| **Root Directory** | `backend-spring` |
| **Environment** | `Java` |
| **Region** | Frankfurt (EU) |
| **Branch** | `main` |
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -jar target/digital-village-api-1.0.0.jar` |
| **Plan** | Free |

### 3. Configurer les variables d'environnement

Dans l'onglet **"Environment"** du Web Service, ajoutez :

```env
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<générer un secret sécurisé de 256 bits minimum>
DB_HOST=<host de votre base PostgreSQL>
DB_PORT=5432
DB_NAME=nird_db
DB_USER=<utilisateur PostgreSQL>
DB_PASSWORD=<mot de passe PostgreSQL>
FRONTEND_URL=https://digital-village-nird.vercel.app
PORT=10000
```

**Note**: Pour `JWT_SECRET`, vous pouvez utiliser :
```bash
openssl rand -base64 32
```

### 4. Lier la base de données (optionnel)

Si vous avez créé la base PostgreSQL sur Render :
1. Dans le Web Service, allez dans **"Environment"**
2. Cliquez sur **"Link Database"**
3. Sélectionnez votre base PostgreSQL
4. Render configurera automatiquement `DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc.

### 5. Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner le code
   - Exécuter `mvn clean package`
   - Démarrer l'application
3. Attendez la fin du build (5-10 minutes la première fois)
4. Votre API sera disponible sur : `https://digital-village-api-spring.onrender.com`

### 6. Vérifier le déploiement

Testez l'endpoint de santé :
```bash
curl https://digital-village-api-spring.onrender.com/api/health
```

Vous devriez recevoir :
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "..."
}
```

## 🔧 Configuration du frontend

Mettez à jour la variable d'environnement dans Vercel :

1. Allez dans votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez/modifiez :
   ```
   NEXT_PUBLIC_API_URL=https://digital-village-api-spring.onrender.com/api
   ```
4. Redéployez le frontend

## 📝 Notes importantes

- **Premier démarrage**: Le premier démarrage peut prendre 5-10 minutes
- **Mode veille**: Sur le plan gratuit, Render met l'application en veille après 15 minutes d'inactivité. Le premier appel après réveil peut prendre 30-60 secondes
- **Base de données**: La base PostgreSQL gratuite a des limites (90 jours, puis suppression si inactif)
- **Logs**: Consultez les logs dans Render Dashboard pour déboguer

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que les variables `DB_*` sont correctement configurées
- Vérifiez que la base PostgreSQL est active

### Erreur de build Maven
- Vérifiez que Java 17+ est disponible (Render le configure automatiquement)
- Consultez les logs de build pour plus de détails

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correctement configuré
- Vérifiez que le frontend utilise la bonne URL API

## 🔄 Mise à jour

Pour mettre à jour le backend :
1. Poussez vos changements sur GitHub
2. Render détectera automatiquement les changements
3. Un nouveau déploiement sera lancé automatiquement

