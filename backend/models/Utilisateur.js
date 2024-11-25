// models/Promotion.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Utilisateur;
