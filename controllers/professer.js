const db = require("../models");
const Excel = require('exceljs');
const ListPurchase = require('../models/purchase');

/*
    /createComment/:account_id/:purchase_id

    account_id = id ของ user
    purchase_id = id ของ purchase ที่รับมา

    เพิ่มความคิดเห็นให้ใบสังซื้อนั้นๆ
    - ปรับให้เหลือแค่ฟังก์ชั้นเดียว เช็ต role level จาก user เลย
*/
const createComment = async (req, res) => {
    console.log('create Comment');
    const { account_id, purchase_id } = req.params;
    const { reason_confirm } = req.body;
    try {
        const account = await db.User.findOne({ where: { account_id: account_id } });
        if(account){
            const purc = await db.Purchase.findOne({ where: { purchase_id: purchase_id } });
            if(purc){
                if(account.role === "level_3") {
                    const reason_confirm_level3 = reason_confirm;
                    const newComment = await db.Comment.create({ purchase_id, reason_confirm_level3 })
                    res.status(200).send(newComment);
                } else if(account.role === "level_2") {
                    const reason_confirm_level2 = reason_confirm;
                    const newComment = await db.Comment.create({ purchase_id, reason_confirm_level2 })
                    res.status(200).send(newComment);
                } else {
                    res.status(400).send({message: "Invalid request"});
                }
            } else {
                res.status(404).send({message: "Purchase Not Found"});
            }
        } else {
            res.status(404).send({message: "User Not Found"});
        }
    }catch(err) {
        res.status(400).send(err);
    }
}

/*
    /createRankDepartment/:from_department/:year

    from_department = id ของแผนงาน
    year = ปีการศึกษา

    สร้างตัวจัดอันดับโครงการของแต่ละปีการศึกษา
*/
const createRankDepartment = async (req, res) => {
    console.log('create Rank Department');
    const { from_department, year } = req.params;
    try {
        const findR_Depart = await db.RankDepartment.findOne({ where: {from_department: from_department, year: year} })
        if(findR_Depart){
            res.status(400).send({message: "Rank Department exist"});
        } else {
            const newRankDepartment = await db.RankDepartment.create({ from_department, year })
            res.status(200).send(newRankDepartment);
        }
    }catch(err) {
        res.status(400).send(err);
    }
}

/*
    /updateRankDepartment/:from_department/:year

    from_department = id ของแผนงาน
    year = ปีการศึกษา

    อัพเดตข้อมูลให้ rank_department record : ตัวจัดอันดับโครงการของแต่ละปีการศึกษา
    
    *ใน req.body.rank_department_details
    จะทำการ loop ข้อมูลโดยการใช้ json เป็นตัวกลาง
    ถ้ามีกี่ตัว ตอนส่งเข้ามาต้องแปลงเป็น json แล้วส่งเข้ามาทีเดียว
    เช่น
    req.body.rank_department_details = [
        {"rank_purchases":1, "purchase_id":"PRCMM20220319003"},
        {"rank_purchases":2, "purchase_id":"PRCMD20220319001"},
    ]
*/
const updateRankDepartment = async (req, res) => {
    console.log("update Rank Department");
    
    const { from_department, year } = req.params;
    
    const targetRankDepartment = await db.RankDepartment.findOne({ where: { from_department: from_department, year: year } });
    if(targetRankDepartment){
        const { rank_department_details } = req.body;
        const details = JSON.parse(rank_department_details);
  
        await db.RankPurchase.destroy({where: {from_rank_id: targetRankDepartment.id}, truncate: true});
            
        const total_purchases = await db.Purchase.count({ where: { year: year } });

        const total_price = await db.Purchase.findAll({
            where: { year: year, status_purchase: "level_3_cf" },
            attributes: [
              //'department_id',
              [db.sequelize.fn('sum', db.sequelize.col('total_price')), 'total_amount'],
            ],
            //group: ['department_id'],
          });
          
        await details.forEach(obj => {
              const { rank_purchases, purchase_id } = obj;
              var from_rank_id = targetRankDepartment.id;

              db.RankPurchase.create({ from_rank_id, rank_purchases, purchase_id });
        });
        
        const total_price_department = total_price[0].dataValues.total_amount;
        
        await  targetRankDepartment.update({
            total_purchases,
            total_price_department
        });
        
        res.status(200).send({ message: `Updated ${targetRankDepartment.from_department}:${targetRankDepartment.year}` });
    } else {
      res.status(404).send({ message: `Not Found` });
    }
}


/*
    /getTotalprice/:year

    from_department = id ของแผนงาน
    year = ปีการศึกษา
*/
const getTotalprice = async (req, res) =>{
    console.log("Get Total Price");
    const {year} = req.params;

    const totalPrice = await db.Purchase.findAll({
        where: {year: year, status_purchase: "level_3_cf"},
        attributes: [
          //'department_id',
          [db.sequelize.fn('sum', db.sequelize.col('total_price')), 'total_amount'],
        ],
        //group: ['department_id'],
      });
    if(totalPrice){
        res.status(200).send(totalPrice);
    }else{
        res.status(404).send({ message: "Something wrong" });
    }
}

/*
    /getExcel/:from_department/:year

    from_department = id ของแผนงาน
    year = ปีการศึกษา
*/
const getExcel = async (req, res) =>{
        console.log("get Excel");
        const {from_department, year} = req.params;
        try {
            //const params = await req.body
            //let list = []
            let { list } = await db.Purchase.findAll({ where: {year: year, status_purchase: "level_3_cf"}})
            console.log("list", list);
            const workbook = new Excel.Workbook()
            const worksheet = workbook.addWorksheet("ง.145")
            
            worksheet.columns = [
                { key: "A", header: ["รายละเอียดงบประมาณหมวดค่าครุภัณฑ์ ที่ดินและสิ่งก่อสร้าง", "ปีงบประมาณ" , "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", "คณะ/หน่วยงาน  ภาควิชา", "แผนงาน", "(1)", "ลำดับ"], width: 10 },
                { key: "B", header: ["","","","","","(2)", "หมวดรายจ่าย", "รายการ"], width: 20 },
                { key: "C", header: ["","","","","","(3)", "มาตรฐานและคุณลักษณะเฉพาะ", "หรือขนาด ลักษณะและโครงสร้าง"], width: 40 },
                { key: "D", header: ["","","","","","(4)", "จำนวน", "หน่วย"], width: 10 },
                { key: "E", header: ["","","","","","(5)", "ราคา", "ต่อหน่วย"], width: 20 },
                { key: "F", header: ["","","","","","(6)", "รวมเงิน"], width: 15 },
                { key: "G", header: ["","","","","","7(คำชี้แจง)", "ความต้องการ", "ทั้งสิ้น"], width: 15 },
                { key: "H", header: ["","","","","","", "มีอยู่แล้ว", "ใช้ได้"], width: 10 },
                { key: "I", header: ["","","","","","", "", "ใช้ไม่ได้"], width: 10 },
                { key: "J", header: ["","","","","","(8)", "เหตุผลความจำเป็น"], width: 40 },
            ]
            worksheet.mergeCells('A1:H1')
            worksheet.mergeCells('A2:H2')
            worksheet.mergeCells('A3:H3')
            worksheet.mergeCells('A4:H4')
            worksheet.mergeCells('A5:H5')
            worksheet.mergeCells('G6:I6')
            worksheet.mergeCells('H7:I7')
            worksheet.mergeCells('A7:A8')
            worksheet.mergeCells('B7:B8')
            worksheet.mergeCells('D7:D8')
            worksheet.mergeCells('E7:F8')
            worksheet.mergeCells('G7:G8')
            worksheet.mergeCells('J7:J8')
            worksheet.getCell('A1').font = { color: { argb: "ffff0000" } }
            worksheet.getCell('A2').font = { color: { argb: "ffff0000" } }
            worksheet.getCell('A3').font = { color: { argb: "ffff0000" } }
            worksheet.getCell('A4').font = { color: { argb: "ffff0000" } }
            worksheet.getCell('A5').font = { color: { argb: "ffff0000" } }
            worksheet.getCell('A1').alignment ={ vertical: 'middle', horizontal: 'center', wrapText: true }
            worksheet.getCell('A2').alignment ={ vertical: 'middle', horizontal: 'center', wrapText: true }
            
            //set alignment & ตาราง
            let rowIndex = 6;
            for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++ ) {
                worksheet.getRow(rowIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                worksheet.eachRow(function (row, rowNumber) {
                    row.eachCell(function (cell, colNumber) {
                      if (rowNumber >= 6) {
                        row.getCell(colNumber).border = {
                            top: { style: "thin" },
                            left: { style: "thin" },
                            bottom: { style: "thin" },
                            right: { style: "thin" },
                          };
                      }
                    });
                  });
            }
        
            worksheet.addRow({ A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I:"", J:"" })
            worksheet.addRow({ A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J:"" })
            var list_id = 0;
            for (var item of list) {
                const check = await db.Sub_Departments.findAll({ where: {sub_name: item.department_id}});
                if(check.from_department_id === from_department){
                    worksheet.addRow({
                        A: list_id,
                        B: item.purchase_name,
                        C: item.detail_item,
                        D: item.number_units,
                        E: item.demand,
                        F: item.total_price,
                        G: item.had_been,
                        H: item.usable,
                        I: item.unusable,
                        J: item.explain_new,
                    })
                    list_id++;
                }
            }
            const convertDate = new Date().toLocaleDateString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: 'numeric',
            })
            const convertTime = new Date().toLocaleTimeString('th-TH')
            const filename = `purchase-${convertDate}-${convertTime}`
            await workbook.xlsx.writeFile(`./download/${filename}.xlsx`)
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            return res.status(200).json({
                filename: filename + `${convertDate} ${convertTime}`,
                path: `./download/${filename}.xlsx`
            })
        } catch (err) {
            console.log(err.message)
            return res.status(400).json({
                message: "error not open excel"
            })
        }
}
module.exports = {
    createComment,
    updateRankDepartment,
    createRankDepartment,
    getTotalprice,
    getExcel,
};