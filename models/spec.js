module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Spec",
      {
        spec_id: { type: DataTypes.STRING(100),},
        purchase_id: { type: DataTypes.STRING(100),},
        department_id: { type: DataTypes.STRING(50)}, //ชื่อภาควิชา ตัวอย่าง: CMM

        file_spec: { type: DataTypes.STRING(255) },
        reason_spec: { type: DataTypes.STRING(500) },

        create_spec: { type: DataTypes.STRING(100)},
        update_spec: { type: DataTypes.STRING(100) },
      },
      { tableName: "specs" }
    );
  
    return model;
  };