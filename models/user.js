module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "User",
      {
        username: { type: DataTypes.STRING(200), unique: true },
        password: { type: DataTypes.STRING(255) },
        name_prefix: { type: DataTypes.STRING(100) },
        first_name: { type: DataTypes.STRING(100) },
        last_name: { type: DataTypes.STRING(100) },
        email: { type: DataTypes.STRING(100)},
        role: { type: DataTypes.STRING(100) },
        tel: { type: DataTypes.STRING(10)},
        department: { type: DataTypes.INTEGER(11) }, //id ของแผนงาน
        department_id: { type: DataTypes.STRING(50) }, //ชื่อภาควิชา ตัวอย่าง: CMM
        account_id: { type: DataTypes.STRING(100)},
      },
      { tableName: "users" }
    );

    return model;
  };