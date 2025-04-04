const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PointEvaluer = sequelize.define("PointEvaluer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_activite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_critere: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Point_evaluers", // Nom réel de ta table
  timestamps: false, // Désactiver les timestamps automatiques si `created_at` et `last_update` sont gérés manuellement
});

module.exports = PointEvaluer;
