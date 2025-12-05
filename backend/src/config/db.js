const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  ⚠️  MODE DEMO - MongoDB non configuré                   ║
║                                                          ║
║  Le backend fonctionne en mode démonstration.            ║
║  Les données ne seront pas persistées.                   ║
║                                                          ║
║  Pour activer MongoDB, créez un fichier .env avec:       ║
║  MONGO_URI=mongodb://localhost:27017/nird_db             ║
╚══════════════════════════════════════════════════════════╝
    `);
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  ⚠️  MODE DEMO - Connexion MongoDB échouée               ║
║                                                          ║
║  Le backend continue en mode démonstration.              ║
║  Vérifiez que MongoDB est installé et démarré.           ║
╚══════════════════════════════════════════════════════════╝
    `);
    isConnected = false;
    return false;
  }
};

const isDBConnected = () => isConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
