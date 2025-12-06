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

**Avant de cliquer sur "Create Web Service"**, allez dans l'onglet **"Environment"** (ou **"Environment Variables"**).

**🎯 Ce que vous allez faire :**
Vous devez ajouter 9 variables d'environnement dans l'interface Render. Ces variables permettent à votre application de se connecter à la base de données et de fonctionner correctement.

**📋 Résumé rapide :**
- **5 variables pour la base de données** → Option A (automatique) OU Option B (manuel)
- **4 variables supplémentaires** → À ajouter manuellement

Vous verrez une section avec des champs pour ajouter des variables. Voici comment procéder :

---

#### Option A : Lier la Base de Données (RECOMMANDÉ) ⭐

**C'est la méthode la plus simple !**

1. Dans la section "Environment Variables", cherchez le bouton **"Link Database"** (ou un lien similaire)
2. Cliquez dessus
3. Dans la liste déroulante, sélectionnez **`nird-postgres`**
4. Render ajoutera automatiquement ces 5 variables pour vous :
   - `DB_HOST` → configuré automatiquement
   - `DB_PORT` → configuré automatiquement
   - `DB_NAME` → configuré automatiquement
   - `DB_USER` → configuré automatiquement
   - `DB_PASSWORD` → configuré automatiquement

✅ **Si vous avez fait ça, passez directement à l'Étape 4 !**

---

#### Option B : Ajouter les Variables de Base Manuellement

**Si vous ne pouvez pas lier la base, ajoutez chaque variable une par une :**

**📍 Où trouver ces informations :**
Allez sur votre base de données `nird-postgres` dans Render, puis dans l'onglet **"Connections"**. Vous y verrez toutes les informations nécessaires.

**Comment ajouter une variable :**
1. Cliquez sur le bouton **"Add Environment Variable"** (ou le bouton avec le symbole **+**)
2. Un nouveau champ apparaît avec deux cases : **Key** (nom) et **Value** (valeur)
3. Remplissez les deux cases
4. Répétez pour chaque variable

**Variables à ajouter (une par une) :**

**Variable 1 :**
- **Key** : `DB_HOST`
- **Value** : `dpg-d4pubep5pdvs738dem40-a.frankfurt-postgres.render.com`
  - 💡 **Note :** Dans l'interface Render, vous voyez juste `dpg-d4pubep5pdvs738dem40-a` comme hostname, mais ajoutez `.frankfurt-postgres.render.com` à la fin pour le hostname complet
- Cliquez sur "Add" ou laissez tel quel

**Variable 2 :**
- **Key** : `DB_PORT`
- **Value** : `5432`
  - 📍 Trouvé dans l'onglet "Connections" de votre base de données

**Variable 3 :**
- **Key** : `DB_NAME`
- **Value** : `nird_db_pfqx`
  - 📍 Trouvé dans l'onglet "Connections" (champ "Database")

**Variable 4 :**
- **Key** : `DB_USER`
- **Value** : `nird_user`
  - 📍 Trouvé dans l'onglet "Connections" (champ "Username")

**Variable 5 :**
- **Key** : `DB_PASSWORD`
- **Value** : *(le mot de passe de votre base de données)*
  - 📍 Trouvé dans l'onglet "Connections" (champ "Password")
  - 💡 **Note :** Le mot de passe est masqué (•••••) dans l'interface. Si vous ne le connaissez pas, vous pouvez :
    - Le révéler en cliquant sur l'icône d'œil à côté du champ
    - Ou créer de nouvelles credentials dans l'onglet "Credentials"

---

### Étape 4 : Ajouter les Autres Variables

**Maintenant, ajoutez ces 4 variables supplémentaires de la même manière :**

**Variable 6 :**
- **Key** : `SPRING_PROFILES_ACTIVE`
- **Value** : `prod`

**Variable 7 :**
- **Key** : `PORT`
- **Value** : `10000`

**Variable 8 :**
- **Key** : `JWT_SECRET`
- **Value** : *(générez d'abord - voir Étape 5 ci-dessous)*

**Variable 9 :**
- **Key** : `FRONTEND_URL`
- **Value** : `https://digital-village-nird.vercel.app`

**📝 À la fin, vous devriez avoir 9 variables au total :**
- 5 variables DB_* (si Option B) OU 5 variables automatiques (si Option A)
- 4 variables supplémentaires (SPRING_PROFILES_ACTIVE, PORT, JWT_SECRET, FRONTEND_URL)

### Étape 5 : Générer JWT_SECRET

**⚠️ IMPORTANT :** Vous devez générer un secret avant d'ajouter la variable `JWT_SECRET` à l'Étape 4.

**Méthode 1 : Windows PowerShell (Recommandé)**

1. Ouvrez PowerShell sur votre ordinateur
2. Copiez-collez cette commande et appuyez sur Entrée :
   ```powershell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```
3. Une longue chaîne de caractères apparaîtra (par exemple : `aB3dEf9GhIjKlMnOpQrStUvWxYz1234567890AbCdEf=`)
4. **Copiez cette chaîne** (Ctrl+C)
5. Retournez sur Render et collez-la dans la valeur de `JWT_SECRET`

**Méthode 2 : En ligne (Plus simple)**

1. Allez sur : https://www.grc.com/passwords.htm
2. Choisissez **64 caractères aléatoires**
3. Cliquez sur "Generate" ou copiez le mot de passe généré
4. **Copiez cette chaîne**
5. Retournez sur Render et collez-la dans la valeur de `JWT_SECRET`

**💡 Astuce :** Vous pouvez générer le secret maintenant, puis l'utiliser quand vous ajoutez la variable `JWT_SECRET` à l'Étape 4.

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

