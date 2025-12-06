# 🐳 Guide : Intégration Docker Hub + CI/CD Pipeline

Ce guide explique comment :
1. Construire et pousser votre image Docker vers Docker Hub
2. Configurer un pipeline CI/CD avec GitHub Actions
3. Utiliser l'image Docker Hub dans Render

## 📋 Prérequis

- ✅ Compte Docker Hub (gratuit) : [hub.docker.com](https://hub.docker.com)
- ✅ Compte GitHub avec le dépôt `digital-village-nird`
- ✅ Service Render configuré

---

## 🎯 Option 1 : CI/CD avec GitHub Actions (RECOMMANDÉ) ⭐

### Étape 1 : Créer un compte Docker Hub

1. Allez sur [hub.docker.com](https://hub.docker.com)
2. Créez un compte gratuit
3. Notez votre **username Docker Hub** (ex: `medazizzormati`)

### Étape 2 : Créer un Repository sur Docker Hub

1. Connectez-vous sur Docker Hub
2. Cliquez sur **"Create Repository"**
3. Remplissez :
   - **Name** : `digital-village-api` (ou le nom que vous préférez)
   - **Visibility** : `Public` (gratuit) ou `Private` (payant)
4. Cliquez sur **"Create"**

### Étape 3 : Configurer les Secrets GitHub

**📍 Où trouver les Secrets GitHub :**

1. Allez sur votre dépôt GitHub : `https://github.com/Medazizzormati/digital-village-nird`
2. Cliquez sur l'onglet **"Settings"** (en haut du dépôt)
3. Dans le menu de gauche, cliquez sur **"Secrets and variables"**
4. Cliquez sur **"Actions"**
5. Cliquez sur le bouton **"New repository secret"** (en haut à droite)

**📝 Comment ajouter chaque secret :**

Pour chaque secret, vous verrez un formulaire avec deux champs :
- **Name** : Le nom du secret (ex: `DOCKER_USERNAME`)
- **Secret** : La valeur du secret (ex: `medazizzormati`)

**Exemple visuel du formulaire :**
```
┌─────────────────────────────────────┐
│ New secret                           │
├─────────────────────────────────────┤
│ Name *                               │
│ [DOCKER_USERNAME              ]     │
│                                     │
│ Secret *                             │
│ [medazizzormati               ]     │
│                                     │
│ [Add secret]                         │
└─────────────────────────────────────┘
```

**Ajoutez ces 2 secrets un par un :**

**Secret 1 : DOCKER_USERNAME**
- **Name** : `DOCKER_USERNAME`
- **Value** : Votre username Docker Hub

**Exemple :**
```
Name: DOCKER_USERNAME
Value: medazizzormati
```
*(Remplacez `medazizzormati` par votre vrai username Docker Hub)*

**Secret 2 : DOCKER_PASSWORD**
- **Name** : `DOCKER_PASSWORD`
- **Value** : Votre mot de passe Docker Hub **OU** un Access Token (recommandé)

**Option A : Utiliser votre mot de passe Docker Hub (simple mais moins sécurisé)**
```
Name: DOCKER_PASSWORD
Value: MonMotDePasseDockerHub123!
```

**Option B : Utiliser un Access Token (RECOMMANDÉ - plus sécurisé) ⭐**

**💡 Comment créer un Access Token Docker Hub :**

1. **Connectez-vous sur [hub.docker.com](https://hub.docker.com)**

2. **Allez dans les paramètres :**
   - Cliquez sur votre profil (en haut à droite)
   - Cliquez sur **"Account Settings"**
   - Dans le menu de gauche, cliquez sur **"Security"**

3. **Créez un nouveau token :**
   - Cliquez sur **"New Access Token"**
   - **Description** : `github-actions-digital-village` (ou un nom de votre choix)
   - **Permissions** : Laissez "Read, Write, Delete" (par défaut)
   - Cliquez sur **"Generate"**

4. **Copiez le token :**
   - ⚠️ **IMPORTANT :** Le token ne sera affiché qu'une seule fois !
   - Copiez-le immédiatement (ex: `dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - Collez-le dans le secret GitHub

**Exemple de token (format réel) :**
```
dckr_pat_AbCdEf1234567890GhIjKlMnOpQrStUvWxYz
```

**Dans GitHub Secrets, vous aurez :**
```
Name: DOCKER_PASSWORD
Value: dckr_pat_AbCdEf1234567890GhIjKlMnOpQrStUvWxYz
```

**✅ Avantages de l'Access Token :**
- Plus sécurisé (vous pouvez le révoquer sans changer votre mot de passe)
- Spécifique à GitHub Actions
- Vous pouvez créer plusieurs tokens pour différents usages

---

**✅ Résumé : Après avoir ajouté les 2 secrets, vous devriez voir :**

Dans GitHub → Settings → Secrets and variables → Actions, vous aurez :

```
Repository secrets (2)
┌─────────────────────────────────────┐
│ 🔒 DOCKER_USERNAME                  │
│    Updated 2 hours ago              │
│    [Update] [Delete]                │
├─────────────────────────────────────┤
│ 🔒 DOCKER_PASSWORD                  │
│    Updated 2 hours ago              │
│    [Update] [Delete]                │
└─────────────────────────────────────┘
```

**🎯 Vérification :**
- ✅ Vous avez 2 secrets : `DOCKER_USERNAME` et `DOCKER_PASSWORD`
- ✅ Les valeurs sont correctes (username Docker Hub et token/mot de passe)
- ✅ Vous pouvez passer à l'étape suivante (créer le workflow)

### Étape 4 : Créer le Workflow GitHub Actions

Créez le fichier `.github/workflows/docker-build-push.yml` :

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main
    paths:
      - 'backend-spring/**'
      - '.github/workflows/docker-build-push.yml'
  workflow_dispatch: # Permet de déclencher manuellement

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/digital-village-api
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend-spring
          file: ./backend-spring/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/digital-village-api:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/digital-village-api:buildcache,mode=max
```

### Étape 5 : Pousser le Workflow sur GitHub

**📋 Prérequis :** Assurez-vous d'avoir terminé les étapes 1-3 (Docker Hub + Secrets GitHub configurés)

**💻 Commandes à exécuter :**

Ouvrez votre terminal dans le dossier du projet et exécutez :

```bash
# 1. Vérifier que le workflow existe
ls .github/workflows/docker-build-push.yml

# 2. Ajouter le workflow à Git
git add .github/workflows/docker-build-push.yml

# 3. Ajouter aussi le guide (optionnel mais recommandé)
git add DEPLOYER_DOCKER_CI_CD.md

# 4. Créer un commit
git commit -m "Add GitHub Actions workflow for Docker build and push"

# 5. Pousser sur GitHub
git push origin main
```

**📝 Exemple de sortie attendue :**

```bash
PS C:\Users\medaz\Downloads\digital-village-v0-design> git add .github/workflows/docker-build-push.yml
PS C:\Users\medaz\Downloads\digital-village-v0-design> git commit -m "Add GitHub Actions workflow for Docker build and push"
[main abc1234] Add GitHub Actions workflow for Docker build and push
 1 file changed, 49 insertions(+)
 create mode 100644 .github/workflows/docker-build-push.yml

PS C:\Users\medaz\Downloads\digital-village-v0-design> git push origin main
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 1.2 KiB | 1.2 MiB/s, done.
To https://github.com/Medazizzormati/digital-village-nird.git
   adbad85..abc1234  main -> main
```

**✅ Vérification :**
- Le workflow est maintenant sur GitHub
- Le pipeline devrait se déclencher automatiquement (passez à l'Étape 6)

### Étape 6 : Vérifier le Pipeline

**📍 Comment accéder aux Actions GitHub :**

1. **Allez sur votre dépôt GitHub :**
   - URL : `https://github.com/Medazizzormati/digital-village-nird`

2. **Cliquez sur l'onglet "Actions"** (en haut de la page, à côté de "Code", "Issues", etc.)

3. **Vous devriez voir :**
   - Une liste de workflows
   - Le workflow **"Build and Push Docker Image"** avec un statut (jaune = en cours, vert = réussi, rouge = échoué)

**📊 Exemple de ce que vous verrez :**

```
┌─────────────────────────────────────────────────────────┐
│ Actions                                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🟡 Build and Push Docker Image                         │
│     main • abc1234 • 2 minutes ago                      │
│     build-and-push • In progress                        │
│                                                          │
│  ✅ Build and Push Docker Image                         │
│     main • xyz7890 • 1 hour ago                         │
│     build-and-push • Completed                          │
└─────────────────────────────────────────────────────────┘
```

**🔍 Comment voir les détails :**

1. **Cliquez sur le workflow en cours** (celui avec le point jaune)
2. Vous verrez les étapes en temps réel :
   - ✅ Checkout code
   - ✅ Set up Docker Buildx
   - ✅ Log in to Docker Hub
   - 🔄 Extract metadata
   - 🔄 Build and push Docker image (c'est la plus longue)

**⏱️ Temps d'attente :**
- **Première fois** : 5-10 minutes (télécharge toutes les dépendances)
- **Fois suivantes** : 3-5 minutes (utilise le cache)

**✅ Signes que ça fonctionne :**
- Le workflow passe de "In progress" (jaune) à "Completed" (vert)
- Vous voyez "Success" à la fin
- L'image apparaît sur Docker Hub (voir ci-dessous)

**❌ Si ça échoue :**
- Cliquez sur le workflow pour voir les logs
- Vérifiez les erreurs (souvent liées aux secrets Docker Hub)
- Voir la section "Problèmes Courants" en bas du guide

**🔗 Vérifier sur Docker Hub :**

Pendant que le workflow tourne, vous pouvez vérifier sur Docker Hub :
1. Allez sur [hub.docker.com](https://hub.docker.com)
2. Connectez-vous
3. Allez dans votre repository `digital-village-api`
4. Une fois le workflow terminé, vous verrez l'image avec le tag `latest`

### Étape 7 : Utiliser l'Image Docker Hub dans Render

**📋 Prérequis :** Le workflow GitHub Actions doit être terminé avec succès et l'image doit être sur Docker Hub.

**🎯 Option A : Utiliser l'image Docker Hub directement (RECOMMANDÉ - Plus rapide) ⭐**

Cette méthode utilise l'image pré-construite sur Docker Hub, donc Render n'a pas besoin de la construire.

**Étapes détaillées :**

1. **Allez sur [render.com](https://render.com)** et connectez-vous

2. **Créez un nouveau Web Service :**
   - Cliquez sur **"New +"** (en haut à droite)
   - Sélectionnez **"Web Service"**

3. **Connectez votre dépôt (ou utilisez l'image directement) :**
   - Si Render demande un dépôt, vous pouvez soit :
     - Connecter le dépôt GitHub (pour les variables d'environnement)
     - OU utiliser uniquement l'image Docker Hub

4. **Configurez le service :**
   - **Name** : `digital-village-api-docker` (ou un nom de votre choix)
   - **Language** : Sélectionnez **"Docker"**
   - **Docker Image** : `medazizzormati/digital-village-api:latest`
     - ⚠️ **Remplacez `medazizzormati` par votre vrai username Docker Hub**
     - Exemple : Si votre username est `john123`, mettez `john123/digital-village-api:latest`
   - **Region** : `Frankfurt` (même région que votre base de données)
   - **Instance Type** : `Free`

5. **Ajoutez les variables d'environnement** (comme dans le guide DEPLOYER_BACKEND.md) :
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   - `SPRING_PROFILES_ACTIVE=prod`
   - `PORT=10000`
   - `JWT_SECRET=...`
   - `FRONTEND_URL=https://digital-village-nird.vercel.app`

6. **Créez le service :**
   - Cliquez sur **"Create Web Service"**
   - Render va pull l'image depuis Docker Hub (plus rapide que de la construire)

**✅ Avantages de cette méthode :**
- ⚡ Plus rapide (pas de build, juste un pull)
- 🔄 Utilise l'image déjà testée sur Docker Hub
- 💰 Moins de ressources utilisées

---

**🎯 Option B : Continuer avec le Dockerfile (build automatique)**

Si vous préférez que Render construise l'image à chaque déploiement :

1. Dans Render, créez un **Web Service**
2. Sélectionnez **"Docker"** comme Language
3. Configurez :
   - **Root Directory** : `backend-spring`
   - **Dockerfile Path** : `backend-spring/Dockerfile`
   - **Docker Build Context Directory** : `backend-spring`
4. Render construira l'image automatiquement à chaque déploiement

**✅ Avantages de cette méthode :**
- 🔄 Build automatique à chaque push
- 🛠️ Plus de contrôle sur le build
- 📦 L'image est aussi disponible sur Docker Hub (grâce au CI/CD)

**💡 Recommandation :**
- Utilisez **Option A** pour la production (plus rapide et fiable)
- Utilisez **Option B** si vous voulez tester des modifications du Dockerfile rapidement

---

## 📊 Résumé Visuel du Flux CI/CD

**Flux complet automatique :**

```
┌─────────────────────────────────────────────────────────┐
│ 1. Vous poussez du code sur GitHub (main)               │
│    git push origin main                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. GitHub Actions se déclenche automatiquement         │
│    (Workflow : Build and Push Docker Image)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. GitHub Actions construit l'image Docker              │
│    - Utilise le Dockerfile                              │
│    - Build avec Maven                                   │
│    - Crée l'image                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. GitHub Actions pousse l'image vers Docker Hub       │
│    medazizzormati/digital-village-api:latest            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Render pull l'image depuis Docker Hub                │
│    (Option A) OU construit depuis Dockerfile (Option B) │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Votre application Spring Boot est déployée ! 🎉      │
└─────────────────────────────────────────────────────────┘
```

**⏱️ Temps total :**
- **Première fois** : ~10-15 minutes (setup + build)
- **Fois suivantes** : ~3-5 minutes (cache + pull rapide)

---

## 🎯 Option 2 : Build et Push Manuel vers Docker Hub

Si vous préférez construire et pousser manuellement :

### Étape 1 : Se connecter à Docker Hub

```bash
docker login
# Entrez votre username et password Docker Hub
```

### Étape 2 : Construire l'image

```bash
cd backend-spring
docker build -t medazizzormati/digital-village-api:latest .
# Remplacez "medazizzormati" par votre username Docker Hub
```

### Étape 3 : Pousser l'image

```bash
docker push medazizzormati/digital-village-api:latest
```

### Étape 4 : Vérifier sur Docker Hub

1. Allez sur [hub.docker.com](https://hub.docker.com)
2. Vérifiez que votre image apparaît dans votre repository

---

## 🔄 Automatisation avec Tags et Versions

### Workflow avec Tags de Version

Pour créer des tags automatiques basés sur les versions :

```yaml
# Dans .github/workflows/docker-build-push.yml
tags: |
  type=ref,event=branch
  type=semver,pattern={{version}}
  type=semver,pattern={{major}}.{{minor}}
  type=raw,value=latest,enable={{is_default_branch}}
```

### Créer un Tag Git

```bash
# Créer un tag
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

Le workflow créera automatiquement l'image : `medazizzormati/digital-village-api:v1.0.0`

---

## 🚀 Utilisation dans Render

### Méthode 1 : Image Docker Hub (Pull)

1. Dans Render → **New Web Service**
2. Sélectionnez **"Docker"**
3. **Docker Image** : `medazizzormati/digital-village-api:latest`
4. Configurez les variables d'environnement
5. Déployez !

### Méthode 2 : Dockerfile (Build automatique)

1. Dans Render → **New Web Service**
2. Sélectionnez **"Docker"**
3. **Dockerfile Path** : `backend-spring/Dockerfile`
4. Render construira l'image automatiquement à chaque déploiement

---

## 📊 Avantages du CI/CD

✅ **Automatisation** : L'image est construite automatiquement à chaque push  
✅ **Traçabilité** : Chaque version est taggée et disponible  
✅ **Rapidité** : Render peut pull l'image pré-construite (plus rapide)  
✅ **Réutilisabilité** : L'image peut être utilisée ailleurs (Kubernetes, autres services)  
✅ **Cache** : Les builds sont plus rapides grâce au cache Docker

---

## 🆘 Problèmes Courants

### ❌ Erreur "unauthorized" lors du push

**Solution :** Vérifiez que vos secrets GitHub (`DOCKER_USERNAME` et `DOCKER_PASSWORD`) sont correctement configurés.

### ❌ Workflow ne se déclenche pas

**Solution :** Vérifiez que le fichier est dans `.github/workflows/` et que le nom se termine par `.yml` ou `.yaml`.

### ❌ Build échoue dans GitHub Actions

**Solution :** Vérifiez les logs dans l'onglet "Actions" de GitHub pour voir l'erreur exacte.

---

## 🎉 C'est fait !

Une fois configuré, à chaque push sur `main` :
1. ✅ GitHub Actions construit automatiquement l'image Docker
2. ✅ L'image est poussée vers Docker Hub
3. ✅ Render peut utiliser cette image (ou continuer avec le Dockerfile)

