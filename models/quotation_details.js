module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Quotation_Details",
      {
        from_quotation_id: { type: DataTypes.STRING(100) },

        company: { type: DataTypes.STRING(255) },
        price_company: { type: DataTypes.FLOAT },
        file_quotation: { type: DataTypes.STRING(255)},
      },
      { tableName: "quotations_details" }
    );
  
    return model;
  };