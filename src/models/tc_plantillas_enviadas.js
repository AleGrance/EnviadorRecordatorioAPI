module.exports = (sequelize, DataType) => {
  const Tc_plantillas_enviadas = sequelize.define("Tc_plantillas_enviadas", {
    plantilla_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Body de la plantilla enviada a la API de tc
    action: {
      type: DataType.STRING,
      allowNull: false,
    },
    token: {
      type: DataType.STRING,
      allowNull: false,
    },
    from: {
      type: DataType.STRING,
      allowNull: false,
    },
    to: {
      type: DataType.STRING,
      allowNull: false,
    },
    template_id: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    template_params: {
      type: DataType.STRING,
      allowNull: false,
    },
    template_media: {
      type: DataType.STRING,
      allowNull: false,
    },
    // Body del response de la API de tc tras enviar la plantilla
    success: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    msg: {
      type: DataType.STRING,
      allowNull: false,
    },
    date: {
      type: DataType.DATE,
      allowNull: false,
    },
    msg_id: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  Tc_plantillas_enviadas.associate = (models) => {
    Tc_plantillas_enviadas.belongsTo(models.Users, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    });
  };
  return Tc_plantillas_enviadas;
};
