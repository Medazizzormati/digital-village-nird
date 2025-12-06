# 🔧 Corriger l'Erreur de Déploiement Render (Status 127)

## ❌ Problème
```
Deploy failed: Exited with status 127
```

Cette erreur signifie que la commande `mvn` n'est pas trouvée.

## ✅ Solution : Corriger les Commandes dans Render

### Dans votre Web Service Render → Settings

**Modifiez les commandes suivantes :**

#### Build Command
**Remplacez :**
```
mvn clean package -DskipTests
```

**Par :**
```
cd backend-spring && ./mvnw clean package -DskipTests
```

**OU (si Maven Wrapper ne fonctionne pas) :**
```
cd backend-spring && mvn -v && mvn clean package -DskipTests
```

#### Start Command
**Remplacez :**
```
java -jar target/digital-village-api-1.0.0.jar
```

**Par :**
```
cd backend-spring && java -jar target/digital-village-api-1.0.0.jar
```

**OU (chemin complet) :**
```
cd backend-spring && java -jar backend-spring/target/digital-village-api-1.0.0.jar
```

## 🔄 Alternative : Utiliser le Root Directory

**Si les commandes ci-dessus ne fonctionnent pas :**

1. **Dans Render → Settings → Root Directory**
   - Changez `backend-spring` en `.` (point)
   - OU laissez vide si vous voulez que Render utilise le root

2. **Build Command :**
   ```
   cd backend-spring && mvn clean package -DskipTests
   ```

3. **Start Command :**
   ```
   cd backend-spring && java -jar target/digital-village-api-1.0.0.jar
   ```

## 🎯 Solution Recommandée (La Plus Simple)

**Dans Render Dashboard :**

1. **Root Directory** : `backend-spring`
2. **Build Command** : `mvn clean package -DskipTests`
3. **Start Command** : `java -jar target/digital-village-api-1.0.0.jar`

**Si ça ne fonctionne toujours pas, essayez :**

1. **Root Directory** : `.` (point)
2. **Build Command** : `cd backend-spring && mvn clean package -DskipTests`
3. **Start Command** : `cd backend-spring && java -jar target/digital-village-api-1.0.0.jar`

## 📋 Checklist de Vérification

- [ ] Root Directory est correct (`backend-spring` ou `.`)
- [ ] Build Command utilise `mvn` (pas `./mvnw` sauf si wrapper installé)
- [ ] Start Command pointe vers le bon chemin du JAR
- [ ] Variables d'environnement sont configurées
- [ ] Base PostgreSQL est liée ou configurée

## 🆘 Si ça ne fonctionne toujours pas

**Vérifiez les logs dans Render :**
1. Allez dans votre Web Service
2. Onglet "Logs"
3. Regardez les erreurs détaillées

**Erreurs courantes :**
- `mvn: command not found` → Utilisez le chemin complet ou Maven Wrapper
- `java: command not found` → Vérifiez que l'environnement est "Java"
- `JAR file not found` → Vérifiez le chemin dans Start Command

