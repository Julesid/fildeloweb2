// models/UtilisateurPromo.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Promotion = require('./Promotion'); // Assure-toi que le modèle est importé

const UtilisateurPromo = sequelize.define('UtilisateurPromotion', {
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Utilisateur', key: 'id' }
  },
  promotion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Promotion', key: 'id' }
  },
  has_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, 
  }
}, {
  timestamps: false, // Si tu n'utilises pas les timestamps
});

UtilisateurPromo.belongsTo(Promotion, { foreignKey: 'promotion_id' });

module.exports = UtilisateurPromo;
