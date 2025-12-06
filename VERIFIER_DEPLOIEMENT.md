# ✅ Vérifier si le Backend est Déployé et Fonctionnel

## 🔍 Étape 1 : Vérifier le Backend sur Render

### Option A : Vérifier via l'URL

Ouvrez dans votre navigateur ou testez avec curl :

```
https://digital-village-api-spring.onrender.com/api/health
```

**Si ça fonctionne**, vous verrez :
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "..."
}
```

**Si ça ne fonctionne pas** :
- ❌ Le backend n'est pas encore déployé
- ❌ Le backend est en veille (attendez 30-60 secondes)
- ❌ L'URL est incorrecte

### Option B : Vérifier dans Render Dashboard

1. Allez sur [render.com](https://render.com)
2. Connectez-vous
3. Vérifiez si vous avez un **Web Service** nommé `digital-village-api-spring`
4. Vérifiez son statut : doit être **"Live"** (vert)

---

## 🔧 Étape 2 : Configurer le Frontend

### Si le Backend est sur Render

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=https://digital-village-api-spring.onrender.com/api
```

**Remplacez** `digital-village-api-spring` par le nom réel de votre Web Service sur Render.

### Si le Backend est Local

Le frontend utilisera automatiquement `http://localhost:5000/api`

---

## 🧪 Étape 3 : Tester la Création de Compte

### Depuis le Frontend

1. **Démarrez le frontend** :
   ```bash
   npm run dev
   ```

2. **Allez sur** : `http://localhost:3000/signup`

3. **Remplissez le formulaire** :
   - Nom : Test User
   - Email : test@example.com
   - **Mot de passe** : `Test123!@#` (doit respecter les règles)
   - Rôle : Élève

4. **Cliquez sur "Créer un compte"**

### Résultats Possibles

#### ✅ Succès
- Vous êtes redirigé vers `/dashboard`
- Un compte est créé dans PostgreSQL
- Vous recevez un token JWT
- Votre profil s'affiche

#### ❌ Erreur "Connection refused" ou "Failed to fetch"
- Le backend n'est pas démarré (local) ou pas déployé (Render)
- L'URL API est incorrecte
- Vérifiez la variable `NEXT_PUBLIC_API_URL`

#### ❌ Erreur "Le mot de passe doit contenir..."
- Le mot de passe ne respecte pas les règles
- Utilisez : `Test123!@#` (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)

#### ❌ Erreur "Cet email est déjà utilisé"
- L'email existe déjà dans la base de données
- Utilisez un autre email

---

## 📋 Checklist Rapide

- [ ] Backend déployé sur Render OU backend local démarré
- [ ] Health check fonctionne (`/api/health`)
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée (si backend sur Render)
- [ ] Frontend redémarré après configuration
- [ ] Test de création de compte réussi

---

## 🆘 Si ça ne fonctionne pas

### Backend Local
```bash
cd backend-spring
mvn spring-boot:run
```

### Backend Render
1. Vérifiez les logs dans Render Dashboard
2. Vérifiez les variables d'environnement
3. Vérifiez que la base PostgreSQL est active

---

## ✅ Si tout fonctionne

Vous pouvez maintenant :
- ✅ Créer des comptes
- ✅ Vous connecter
- ✅ Les données sont sauvegardées dans PostgreSQL
- ✅ Les IDs sont des UUID sécurisés

