const db = require("../models");

    /*
      /createUser

      method ตั้ง account_id
      department_id + (id ของ) department + year + (จำนวนของ user ทั้งหมด + 1) user_counter
      CMM 01 2022 1 : CMM0120221

      name_prefix = คำนำหน้า
      first_name = ชื่อจริง
      last_name = นามสกุล
      email = อีเมล
      role = ระดับ level
      tel = เบอร์โทร
      department = id ของแผนงาน
      department_id = ชื่อภาควิชา
    */
    const createUser = async (req, res) => {
        console.log("createUser");
        const { name_prefix, first_name, last_name, email, role, tel, department, department_id } = req.body;

        const convertDate = new Date().getFullYear();
        const count = await db.User.count();

        let account_id = `${department_id}${('0'+department).slice(-2)}${convertDate}${('0'+(count+1)).slice(-2)}`;
        let username = account_id;

        try{
            const newUser = await db.User.create({ username, name_prefix, first_name, last_name, email, role, tel, department, department_id, account_id });
            res.status(200).send(newUser);
        }catch(err){
            res.status(400).send(err);
        }
    }

    /*
      /updateUser/:id
      
      ค้น id จาก account_id ของ users

      name_prefix = คำนำหน้า
      first_name = ชื่อจริง
      last_name = นามสกุล
      email = อีเมล
      role = ระดับ level
      tel = เบอร์โทร
      department = id ของแผนงาน
      department_id = ชื่อภาควิชา
    */
    const updateUser = async (req, res) => {
      console.log("updateUser");
      const targetId = req.params.id;
      const { name_prefix, first_name, last_name, email, role, tel, department, department_id } = req.body;
      
      const targetUser = await db.User.findOne({ where: { account_id: targetId } });
      
      
      let account_id = `${department_id}${'0'+department.slice(-2)}${convertDate}${count+1}`;
    
      if (targetUser) {
        await targetUser.update({
            name_prefix, 
            first_name, 
            last_name, 
            email, 
            tel, 
            department, 
            department_id,
            account_id,
        });
        res.status(200).send({ message: `Updated ${targetId}` });
      } else {
        res.status(404).send({ message: `Not Found` });
      }
    }

    /*
      /deleteUser/:id

      ไม่ได้ค้นจาก username
      ค้นจาก account_id ของ user ในการค้นหา

    */
    const deleteUser = async (req, res) => {
        const targetUser = await db.User.findOne({ 
            where: { account_id: req.params.id }, 
        });
    
        if (targetUser) {
          await targetUser.destroy();
          res.status(200).send();
        } else {
          res.status(404).send("Not Found User ");
        }
    };

    /*
      /getUsers

      ไม่ได้ค้นจาก username
      ค้นจาก account_id ของ user ในการค้นหา

    */
    const getUsers = async (req, res) => {
      const targetUser = await db.User.findAll({ 
        attributes: {exclude: ['password']}
      });

      if (targetUser) {
        res.status(200).send(targetUser);
      } else {
        res.status(404).send("No Users Found");
      }
    };

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
};