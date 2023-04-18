"use strict";

module.exports = function (sequelize, DataType) {
  var Tc_plantillas = sequelize.define("Tc_plantillas", {
    plantilla_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Body del response de la API de tc luego de solicitar la plantilla
    success: {
      type: DataType.BOOLEAN,
      allowNull: false
    },
    date: {
      type: DataType.DATE,
      allowNull: false
    },
    id: {
      type: DataType.STRING,
      allowNull: false
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    type: {
      type: DataType.STRING,
      allowNull: false
    },
    variables: {
      type: DataType.STRING,
      allowNull: false
    },
    text: {
      type: DataType.STRING,
      allowNull: false
    }
  });
  Tc_plantillas.associate = function (models) {
    Tc_plantillas.belongsTo(models.Users, {
      foreignKey: {
        name: 'user_id',
        allowNull: false
      }
    });
  };
  return Tc_plantillas;
};