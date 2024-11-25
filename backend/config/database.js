// config/database.js

const { Sequelize } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize('202425_fildelo_jcheminat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;
