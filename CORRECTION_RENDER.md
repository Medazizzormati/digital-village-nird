# 🔧 Correction : Render utilise Node.js au lieu de Java

## ❌ Problème Identifié

```
==> Using Node.js version 22.16.0 (default)
==> Running build command 'mvn clean package -DskipTests'...
bash: line 1: mvn: command not found
```

**Le problème :** Render a détecté votre projet comme un projet **Node.js** au lieu de **Java**.

## ✅ Solution : Changer l'Environnement

### Dans Render Dashboard → Votre Web Service → Settings

1. **Trouvez le champ "Environment"** ou "Runtime"
2. **Changez de "Node" à "Java"**
3. **Sauvegardez**

### Configuration Correcte

| Paramètre | Valeur |
|-----------|--------|
| **Environment** | `Java` ⚠️ **IMPORTANT** |
| **Root Directory** | `backend-spring` |
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -jar target/digital-village-api-1.0.0.jar` |

## 🔄 Étapes Détaillées

### 1. Allez dans Settings
- Dans votre Web Service sur Render
- Cliquez sur l'onglet **"Settings"**

### 2. Trouvez "Environment" ou "Runtime"
- Cherchez le champ qui dit "Node.js" ou "Node"
- Changez-le en **"Java"**

### 3. Vérifiez les Commandes
- **Build Command** : `mvn clean package -DskipTests`
- **Start Command** : `java -jar target/digital-village-api-1.0.0.jar`

### 4. Sauvegardez et Redéployez
- Cliquez sur **"Save Changes"**
- Render redéploiera automatiquement
- Cette fois, il utilisera Java et Maven sera disponible

## ✅ Après Correction

Vous devriez voir dans les logs :
```
==> Using Java version 17 (ou 21)
==> Running build command 'mvn clean package -DskipTests'...
[INFO] Scanning for projects...
[INFO] Building Digital Village NIRD API 1.0.0
...
[INFO] BUILD SUCCESS
```

## 🆘 Si "Java" n'apparaît pas dans les options

1. **Supprimez le Web Service actuel**
2. **Créez un nouveau Web Service**
3. **Lors de la création**, sélectionnez **"Java"** comme environnement dès le début
4. Ne laissez pas Render détecter automatiquement (il détectera Node.js à cause du package.json à la racine)

## 📝 Note Importante

Si vous avez un `package.json` à la racine du projet (pour le frontend Next.js), Render peut le détecter comme projet Node.js. C'est pourquoi il faut **explicitement** sélectionner **"Java"** comme environnement.

