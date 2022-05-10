module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Sub_Departments",
      {
        sub_name: { type: DataTypes.STRING(255), unique: true }, //ชื่อภาควิชา: CMM
        from_department_id: { type: DataTypes.INTEGER(11) }, //id หลักจาก departments table
      },
      { tableName: "sub_departments" }
    );
  
    return model;
  };