// models/Promotion.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
const UtilisateurPromo = require("./UtilisateurPromo");
const Etudiant = require("./Etudiant"); // Ajoute ça si ce n'est pas fait





// Définition du modèle Promotion
const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  annee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Promotion.hasMany(UtilisateurPromo, { foreignKey: "promotion_id" });
UtilisateurPromo.belongsTo(Promotion, { foreignKey: "promotion_id" });



module.exports = Promotion;
