module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "User_account",
      {
        account_id: { type: DataTypes.STRING(200), unique: true },
        password: { type: DataTypes.STRING(255) },
        role: { type: DataTypes.STRING(100) },
      },
      { tableName: "user_accounts" } 
    );
  
    return model;
  };