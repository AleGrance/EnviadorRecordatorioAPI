"use strict";

module.exports = function (sequelize, DataType) {
  var Roles = sequelize.define('Roles', {
    role_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataType.STRING,
      allowNull: false
    }
  });
  Roles.associate = function (models) {
    Roles.hasMany(models.Users, {
      foreignKey: {
        name: 'role_id',
        allowNull: false
      }
    });
  };
  return Roles;
};