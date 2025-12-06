# 🚀 Guide : Déployer le Backend Spring Boot sur Render

## 📋 Prérequis
- ✅ Base PostgreSQL déjà créée sur Render (`nird-postgres`)
- ✅ Compte Render connecté à GitHub
- ✅ Code poussé sur GitHub

## 🎯 Étapes de Déploiement

### Étape 1 : Créer le Web Service

1. **Allez sur [render.com](https://render.com)** et connectez-vous

2. **Cliquez sur "New +"** (en haut à droite)

3. **Sélectionnez "Web Service"**

4. **Connectez votre dépôt GitHub** :
   - Si pas encore connecté, cliquez sur "Connect GitHub"
   - Autorisez Render à accéder à vos dépôts
   - Sélectionnez le dépôt : `Medazizzormati/digital-village-nird`

### Étape 2 : Configurer le Web Service

**Remplissez le formulaire :**

| Champ | Valeur |
|-------|--------|
| **Name** | `digital-village-api-spring` |
| **Root Directory** | `backend-spring` |
| **Environment** | `Java` |
| **Region** | `Frankfurt` (même région que votre base) |
| **Branch** | `main` |
| **Build Command** | `./mvnw clean package -DskipTests` (ou `mvn clean package -DskipTests` si Maven est disponible) |
| **Start Command** | `java -jar target/digital-village-api-1.0.0.jar` |
| **Plan** | `Free` |

### Étape 3 : Configurer les Variables d'Environnement

**Avant de cliquer sur "Create Web Service"**, allez dans l'onglet **"Environment"** :

#### Option A : Lier la Base (RECOMMANDÉ) ⭐

1. Cliquez sur **"Link Database"**
2. Sélectionnez **`nird-postgres`**
3. Render configurera automatiquement :
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`

#### Option B : Ajouter Manuellement

Si vous ne liez pas, ajoutez ces variables **une par une** :

```
Key: DB_HOST
Value: dpg-d4pubep5pdvs738dem40-a.frankfurt-postgres.render.com
```

```
Key: DB_PORT
Value: 5432
```

```
Key: DB_NAME
Value: nird_db_pfqx
```

```
Key: DB_USER
Value: nird_user
```

```
Key: DB_PASSWORD
Value: n4Sfsx5DHrxnhGUS7sOb3CTaGghHDiq5
```

### Étape 4 : Ajouter les Autres Variables

**Ajoutez ces variables supplémentaires :**

```
Key: SPRING_PROFILES_ACTIVE
Value: prod
```

```
Key: PORT
Value: 10000
```

```
Key: JWT_SECRET
Value: [générez un secret - voir ci-dessous]
```

```
Key: FRONTEND_URL
Value: https://digital-village-nird.vercel.app
```

### Étape 5 : Générer JWT_SECRET

**Windows PowerShell :**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Ou en ligne :**
https://www.grc.com/passwords.htm (choisissez 64 caractères)

Copiez le résultat et collez-le dans la variable `JWT_SECRET`.

### Étape 6 : Créer le Service

1. **Vérifiez** que toutes les variables sont ajoutées
2. **Cliquez sur "Create Web Service"**
3. **Attendez** le déploiement (5-10 minutes la première fois)

### Étape 7 : Vérifier le Déploiement

**Dans l'onglet "Logs"**, vous devriez voir :
```
✅ Started DigitalVillageApiApplication
✅ Hibernate: create table users
✅ Application started successfully
```

**Testez l'API :**
```bash
curl https://digital-village-api-spring.onrender.com/api/health
```

**Réponse attendue :**
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "..."
}
```

## ✅ Checklist Finale

- [ ] Web Service créé sur Render
- [ ] Base PostgreSQL liée OU variables DB_* configurées
- [ ] Toutes les variables d'environnement ajoutées
- [ ] JWT_SECRET généré et configuré
- [ ] Déploiement terminé (vérifier les logs)
- [ ] Health check réussi
- [ ] URL du backend notée

## 🔗 Après le Déploiement

**Notez l'URL de votre API :**
```
https://digital-village-api-spring.onrender.com
```

**Configurez le frontend :**
1. Créez `.env.local` à la racine :
   ```
   NEXT_PUBLIC_API_URL=https://digital-village-api-spring.onrender.com/api
   ```
2. Redémarrez le frontend

## 🆘 Problèmes Courants

### ❌ Build échoue
- Vérifiez que `Root Directory` = `backend-spring`
- Vérifiez que `Build Command` = `mvn clean package -DskipTests`

### ❌ Erreur de connexion à la base
- Vérifiez que la base PostgreSQL est active
- Vérifiez les variables `DB_*`
- Si vous avez lié la base, vérifiez que le lien est actif

### ❌ Application ne démarre pas
- Vérifiez les logs pour les erreurs
- Vérifiez que `PORT=10000` est configuré
- Vérifiez que `JWT_SECRET` est configuré

## 🎉 C'est fait !

Une fois déployé, vous pouvez :
- ✅ Créer des comptes depuis votre site
- ✅ Vous authentifier
- ✅ Les données sont sauvegardées dans PostgreSQL

