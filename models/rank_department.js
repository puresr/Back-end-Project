module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "RankDepartment",
      {
        from_department: { type: DataTypes.INTEGER(11) }, //เก็บเป็น id ของแผนงาน
        year: { type: DataTypes.INTEGER(4) }, //ปีการศึกษา
        total_purchases: { type: DataTypes.STRING(100) }, //จำนวนรายการทั้งหมด
        total_price_department: { type: DataTypes.INTEGER(11) }, //ยอดรวมทั้งหมดในปีนั้นๆ
        confirm: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      },
      { tableName: "rank_departments" }
    );
  
    return model;
  };