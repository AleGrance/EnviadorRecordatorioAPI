module.exports = (sequelize, DataType) => {
  const Tc_lead = sequelize.define("Tc_lead", {
    record_id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Body del lead enviado a la API de tc
    action: {
      type: DataType.STRING,
      allowNull: false,
    },
    token: {
      type: DataType.STRING,
      allowNull: false,
    },
    campaing_id: {
      type: DataType.STRING,
      allowNull: false,
    },
    // Datos del atrubito Fields
    nombre_completo: {
      type: DataType.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataType.STRING,
      allowNull: false,
    },
    // Body del response de la API de tc luego de enviar el lead
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
    lead_id: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  Tc_lead.associate = (models) => {
    Tc_lead.belongsTo(models.Users, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
    });
  };
  return Tc_lead;
};
