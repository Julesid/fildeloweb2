// models/Promotion.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
const UtilisateurPromo = require("./UtilisateurPromo");




// Définition du modèle Promotion
const Promotion = sequelize.define('Promotion', {
  annee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Promotion.hasMany(UtilisateurPromo, { foreignKey: "promotion_id" });
UtilisateurPromo.belongsTo(Promotion, { foreignKey: "promotion_id" });

module.exports = Promotion;
