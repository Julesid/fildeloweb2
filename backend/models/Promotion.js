// models/Promotion.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  annee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Promotion;
