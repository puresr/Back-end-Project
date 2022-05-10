module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
      "Purchase",
      {
        department_id: { type: DataTypes.STRING(50),}, //ชื่อภาควิชา ตัวอย่าง: CMM
        purchase_id: { type: DataTypes.STRING(100),},

        purchase_name: { type: DataTypes.STRING(500),},
        number_units: { type: DataTypes.INTEGER(10) },
        unit_price: { type: DataTypes.FLOAT},
        demand: { type: DataTypes.INTEGER(10)},
        total_price: { type: DataTypes.FLOAT},
        detail_item: { type: DataTypes.STRING(500) },
        
        year: { type: DataTypes.INTEGER(4) }, //ปีการศึกษา
        
        had_been: { type: DataTypes.BOOLEAN},
        usable: { type: DataTypes.INTEGER(10) },
        unusable: { type: DataTypes.INTEGER(10) },

        new_item: { type: DataTypes.BOOLEAN},
        explain_new: { type: DataTypes.STRING(500) },
        add: { type: DataTypes.BOOLEAN},
        replace: { type: DataTypes.BOOLEAN},
        research: { type: DataTypes.BOOLEAN},
        explain_research: { type: DataTypes.STRING(500) },
        teach: { type: DataTypes.BOOLEAN},
        explain_teach: { type: DataTypes.STRING(500) },

        reason_purchase: { type: DataTypes.STRING(500) }, 

        create_purchase: { type: DataTypes.STRING(100) },
        update_purchase: { type: DataTypes.STRING(100) },
        status_purchase: { type: DataTypes.STRING(10) },
      },
      { tableName: "purchases" }
    );

    return model;
  };