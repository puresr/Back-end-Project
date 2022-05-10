module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "RankPurchase",
      {
        from_rank_id: { type: DataTypes.INTEGER(11) }, //เก็บ id ของแต่ละ rank_department
        rank_purchases: { type: DataTypes.INTEGER(11) }, //priority ของแต่ละ purchase
        purchase_id: { type: DataTypes.STRING(100) }, //purchase_id ของแต่ละ purchases
      },
      { tableName: "rank_purchase" }
    );
  
    return model;
  };