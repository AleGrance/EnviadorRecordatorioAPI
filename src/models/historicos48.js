module.exports = (sequelize, DataType) => {
  const Historicos48 = sequelize.define("Historicos48", {
    historico_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataType.DATEONLY,
      allowNull: false,
      unique: true
    },
    cant_enviados: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    cant_no_enviados: {
      type: DataType.BIGINT,
      allowNull: false,
    },
  }, {freezeTableName: true});

  Historicos48.associate = (models) => {
    Historicos48.belongsTo(models.Users, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
        defaultValue: 1,
      },
    });
  };

  return Historicos48;
};
