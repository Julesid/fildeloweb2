const { Sequelize } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize('202425_fildelo_jcheminat2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Désactive les logs SQL pour plus de lisibilité
});

// Export de l'instance Sequelize
module.exports = sequelize;
