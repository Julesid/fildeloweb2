// models/Epreuve.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Epreuve = sequelize.define('Epreuve', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Epreuve;
