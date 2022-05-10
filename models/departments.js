module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Departments",
      {
        department_name: { type: DataTypes.STRING(255) }, //ชื่อแผนงาน: คอมพิวเตอร์และเทคโนโลยีสารสนเทศ
      },
      { tableName: "departments" }
    );
  
    return model;
  };