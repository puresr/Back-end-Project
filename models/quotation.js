module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Quotation",
      {
        quotation_id: { type: DataTypes.STRING(100),},

        purchase_id: { type: DataTypes.STRING(100),},
        department_id: { type: DataTypes.STRING(50)}, //ชื่อภาควิชา ตัวอย่าง: CMM
        reason_quotation: { type: DataTypes.STRING(500)},

        creatr_quotation: { type: DataTypes.STRING(100) },
        updatr_quotation: { type: DataTypes.STRING(100)},
      },
      { tableName: "quotations" }
    );

    return model;
  };