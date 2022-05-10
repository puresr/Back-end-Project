module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Comment",
      {
        purchase_id: { type: DataTypes.STRING(100)}, 

        reason_confirm_level2: { type: DataTypes.STRING(500)},
        reason_confirm_level3: { type: DataTypes.STRING(500)},
        reason_confirm_level4: { type: DataTypes.STRING(500)},
      },
      { tableName: "comments" }
    );
  
    return model;
  };