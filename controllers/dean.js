const db = require("../models");

/*
    /createConfirm/:account_id/:department/:year
    
    account_id = id ของ user
    department = id ของแผนงานหลัก
    year = ปีการศึกษา
    
    เป็นการกด confirm การจัดอันดับโครงการของแผนงานนั้นๆ **สำหรับ admin
    *ต้องมี rank department เก่าก่อน (user ต้องเป็นคนสร้าง)
*/
const createConfirm = async (req, res) => {
    console.log("Confirm");
    const { confirm } = req.body;
    const { account_id, department, year } = req.params;
    
    try{
        const account = await db.User.findOne({ where: { account_id: account_id } });
        if(account){
            if(account.role === "admin"){
                const newSubmit = await db.RankDepartment.findOne({ where: { from_department: department, year: year } });
                if(newSubmit){
                    newSubmit.update({confirm});
                    res.status(200).send({message: `Update Success`, department_id: newSubmit.from_department, year: newSubmit.year, confirm: newSubmit.confirm});
                } else {
                    res.status(404).send({message: "Rank Department Not Found"});
                }
            } else {
                res.status(400).send({message: "Invalid request"});
            }
        } else {
            res.status(404).send({message: "User Not Found"});
        }
    }catch(err){
        res.status(400).send(err);
    }
}

module.exports = {
    createConfirm
};