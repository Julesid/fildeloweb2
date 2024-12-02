// models/Activite.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activites = sequelize.define('Activites', {
  libelle: {
    type: DataTypes.STRING(175), // Taille maximale définie dans la base
    allowNull: false,
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Activites;
