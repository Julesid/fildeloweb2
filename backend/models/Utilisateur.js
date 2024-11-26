// models/Utilisateur.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct
const UtilisateurPromo = require("./UtilisateurPromo");


// Définition du modèle Utilisateur
const Utilisateur = sequelize.define('Utilisateur', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  mdp_bcrypt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type_utilisateur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Utilisateur.hasMany(UtilisateurPromo, { foreignKey: "utilisateur_id" });
UtilisateurPromo.belongsTo(Utilisateur, { foreignKey: "utilisateur_id" });

module.exports = Utilisateur;
