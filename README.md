# 🏘️ Digital Village NIRD

[![Nuit de l'Info 2025](https://img.shields.io/badge/Nuit%20de%20l'Info-2025-blue?style=for-the-badge)](https://www.nuitdelinfo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **Le Village Numérique Résistant** - Une plateforme éducative pour accompagner les établissements scolaires vers un numérique souverain, inclusif et durable.

![Digital Village Banner](https://raw.githubusercontent.com/Medazizzormati/digital-village-nird/main/public/og-image.png)

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Déploiement](#-déploiement)
- [Équipe](#-équipe)
- [Licence](#-licence)

## 🎯 À propos

**Digital Village** est un projet réalisé dans le cadre de la **Nuit de l'Info 2025**, répondant au défi proposé par le collectif NIRD (Numérique Inclusif, Responsable et Durable).

### Le Défi

> "Comment les établissements scolaires peuvent tenir tête aux Big Tech ?"
> 
> David contre Goliath, Astérix contre l'Empire numérique

Notre solution propose une plateforme web éducative et interactive pour :
- Comprendre la démarche NIRD en 5 étapes
- Découvrir les alternatives libres (Linux, LibreOffice, etc.)
- Apprendre la sobriété numérique
- Protéger les données des élèves

## ✨ Fonctionnalités

### 🎮 Expérience Gamifiée
- Système de progression avec XP et niveaux
- Badges et récompenses
- Tableau de bord personnalisé
- Streaks quotidiens

### 📚 Contenu Éducatif
- Présentation des 5 étapes NIRD
- Bibliothèque de ressources (PDF, vidéos, tutoriels)
- Lecteur vidéo intégré (YouTube, PeerTube)

### 🤖 Quiz Intelligent
- Génération de questions par IA (OpenAI)
- 80+ questions sur 8 thèmes différents
- Mode hors-ligne avec questions de fallback
- Sujets : Linux, Sécurité, Environnement, Logiciels Libres, etc.

### 👥 Gestion des Utilisateurs
- Authentification JWT sécurisée
- Rôles : Élève, Enseignant, Admin, Public
- Mode démo sans base de données

### 🎨 Design Professionnel
- Interface gaming moderne
- Mode sombre avec effets néon
- Responsive (mobile-first)
- Animations fluides

## 🛠️ Technologies

### Frontend
- **Next.js 15** (React 19, App Router)
- **Tailwind CSS 4**
- **TypeScript**
- **Lucide Icons**

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** pour l'authentification
- **Bcrypt** pour le hachage

### Outils
- **OpenAI API** (génération de quiz)
- **Vercel** (déploiement)

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- MongoDB (optionnel - mode démo disponible)

### Frontend

```bash
# Cloner le dépôt
git clone https://github.com/Medazizzormati/digital-village-nird.git
cd digital-village-nird

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Le frontend sera disponible sur http://localhost:3000

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
echo "PORT=5000
JWT_SECRET=votre_secret_jwt
MONGO_URI=mongodb://localhost:27017/nird_db" > .env

# Lancer en développement
npm run dev
```

Le backend sera disponible sur http://localhost:5000

## 🌐 Déploiement

### Vercel (Frontend)

1. Connectez votre dépôt GitHub à Vercel
2. Sélectionnez le framework **Next.js**
3. Ajoutez les variables d'environnement si nécessaire :
   - `OPENAI_API_KEY` (optionnel, pour le quiz IA)
4. Déployez !

### Variables d'environnement (optionnelles)

```env
# Pour le quiz IA (optionnel)
OPENAI_API_KEY=sk-...

# Pour le backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
```

## 👥 Équipe

Projet réalisé par l'équipe **Digital Village** :

| Nom | Rôle |
|-----|------|
| **Mohammed Aziz** | Développeur Full-Stack |
| **Mohamed Chaouki** | Développeur Frontend |
| **Yassine Zormati** | Documentation |
| **Firas Garraoui** | UI/UX Designer |
| **Amin Masri** | Développeur Frontend |
| **Yassine Ajroud** | Développeur Backend |
| **Majd Khmaja** | Développeur Backend  |
| **Ali Mahjoub** | Tests & QA |

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<p align="center">
  Réalisé avec ❤️ pour la <strong>Nuit de l'Info 2025</strong>
  <br>
  <a href="https://www.nuitdelinfo.com/">nuitdelinfo.com</a> | 
  <a href="https://nird.fr/">NIRD</a>
</p>

