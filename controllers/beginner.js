const e = require("express");
const db = require("../models");

//Quotation
/*
  /createQuotation/:account_id
  
  account_id = account_id ของคนที่ใช้ api นี้

  รูปแบบการตั้ง quotation_id 
    PO<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร>
    POCMM20210119001

  *ใน req.body.quotation_details
  จะทำการ loop ข้อมูลโดยการใช้ json เป็นตัวกลาง
  ถ้ามีกี่ตัว ตอนส่งเข้ามาต้องแปลงเป็น json แล้วส่งเข้ามาทีเดียว
  เช่น
  req.body.quotation_details = [
    {"company":"บ. 1", "price_company":10000, "file_quotation":""},
    {"company":"บ. 2", "price_company": 20000, "file_quotation":""}
  ]

*/
const createQuotation = async (req, res) => {
  console.log("createQuotation");
  const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
  if(account){
    const {purchase_id, quotation_details} = req.body;
    const targetQuotation = await db.Quotation.findOne({ where: { purchase_id: purchase_id } });
    
    if(targetQuotation){
      res.status(400).send({message: "Quotation exist"});
    } else {
      const department_id = account.department_id;
    
      const pid_count = await db.Quotation.count({ where: { department_id: department_id } });
      const pid_year = new Date().getFullYear();
      const pid_month = new Date().getMonth();
      const pid_day = new Date().getDate();
      //PO<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร>
      let quotation_id = `PO${department_id+pid_year+('0'+pid_month).slice(-2)+('0'+pid_day).slice(-2)+('00'+(pid_count+1)).slice(-3)}` 

      const { reason_quotation } = req.body;
      var creatr_quotation = account.account_id;

      try{
          const newQuotation = await db.Quotation.create({ quotation_id, purchase_id, department_id, reason_quotation, creatr_quotation });

          const details = JSON.parse(quotation_details)
          
          await details.forEach(obj => {
            const { company, price_company, file_quotation } = obj;
            var from_quotation_id = quotation_id;
            
            db.Quotation_Details.create({ from_quotation_id, company, price_company, file_quotation });
          });

          res.status(200).send(newQuotation);
      }catch(err){
          res.status(400).send(err);
      }
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
}

/*
  /updateQuotation/:account_id/:quotation_id
  
  account_id = account_id ของคนที่ใช้ api นี้
  quotation_id = id ของ quotation นี้


  *ใน req.body.quotation_details
  จะทำการ loop ข้อมูลโดยการใช้ json เป็นตัวกลาง
  ถ้ามีกี่ตัว ตอนส่งเข้ามาต้องแปลงเป็น json แล้วส่งเข้ามาทีเดียว
  เช่น
  req.body.quotation_details = [
    {"company":"บ. 1", "price_company":10000, "file_quotation":""},
    {"company":"บ. 2", "price_company": 20000, "file_quotation":""}
  ]

*/
const updateQuotation = async (req, res) => {
    console.log("updateQuotation");
    const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
    if(account){
    const {quotation_id} = req.params;
    const {purchase_id, quotation_details, reason_quotation} = req.body;
    const targetQuotation = await db.Quotation.findOne({ where: { quotation_id: quotation_id } });
    const updatr_quotation = account.account_id;
    
    if(targetQuotation){
      const quotation_id = targetQuotation.quotation_id;

      const editedexistaQuotation = await db.Quotation.findOne({ where: { purchase_id: purchase_id } });

      if(editedexistaQuotation && editedexistaQuotation.quotation_id != quotation_id){
        res.status(400).send({message: "Quotation exist"});
      } else {
        await targetQuotation.update({
          purchase_id, reason_quotation, updatr_quotation
        });
  
        const details = JSON.parse(quotation_details)
  
  
        await db.Quotation_Details.destroy({where: {from_quotation_id: quotation_id}, truncate: true});
            
        await details.forEach(obj => {
              const { company, price_company, file_quotation } = obj;
              var from_quotation_id = quotation_id;
              
              db.Quotation_Details.create({ from_quotation_id, company, price_company, file_quotation });
            });
  
        res.status(200).send({ message: `Updated ${targetQuotation.quotation_id}` });
      }
    } else {
      res.status(400).send({message: "Quotation Not Found"});
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
}

//Purchase
/*
  /createPurchase/:account_id
  
  account_id = รหัสของ user ที่ Login (ไม่ใช่ username)

  รูปแบบการตั้ง purchase_id 
    PR<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร>
    PRCMM20210119001

*/
const createPurchase = async (req, res) => {
    console.log("createPurchase");
    const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
    if(account){
      const department_id = account.department_id;
      //const department = await db.Sub_Departments.findOne({ where: { sub_name: department_id } });
     
      const pid_count = await db.Purchase.count({ where: { department_id: department_id } });
      const pid_year = new Date().getFullYear();
      const pid_month = new Date().getMonth();
      const pid_day = new Date().getDate();
      //PR<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร></ลำดับเอกสาร>
      let purchase_id = `PR${department_id+pid_year+('0'+pid_month).slice(-2)+('0'+pid_day).slice(-2)+('00'+(pid_count+1)).slice(-3)}` 
  
      const { 
        purchase_name, 
        number_units, 
        unit_price, 
        demand, 
        detail_item, 
        
        year,

        had_been, 
        usable, 
        unusable, 

        new_item, 
        explain_new, 
        add,
        replace,
        research,
        explain_research, 
        teach,
        explain_teach, 
        
        reason_purchase,
      } = req.body;
  
      var total_price = unit_price * demand;
      var create_purchase = req.params.account_id;
      /*
        status_purchase

        level_1_pd = level 1 pending
        level_1_ed = level 1 edited

        level_2_cf = level 2 confirm
        level_2_rj = level 2 reject
        level_2_ed = level 2 edited

        level_3_cf = level 3 confirm
        level_3_rj = level 3 reject
      */
      var status_purchase = 'level_1_pd';

      try{
          const newPurchase = await db.Purchase.create({ 
            department_id, 
            purchase_id, 
            
            purchase_name, 
            number_units, 
            unit_price, 
            demand, 
            total_price, 
            detail_item,
            
            year,
  
            had_been, 
            usable, 
            unusable, 
            
            new_item, 
            explain_new, 
            add,
            replace,
            research,
            explain_research, 
            teach,
            explain_teach, 
            
            reason_purchase, 
  
            create_purchase,
            status_purchase
          });
          res.status(200).send(newPurchase);
      }catch(err){
          res.status(400).send(err);
      }
    } else {
      res.status(404).send({message: "User Not Found"});
    }
}


/*
  /updatePurchase/:account_id/:purchase_id

  account_id = account_id ของคนที่ใช้ api นี้
  purchase_id = id ของ purchase

  *department_id ของ account ของคนที่มาแก้ไขต้องเป็น ตัวเดียวกันกับใน purchase
*/
const updatePurchase = async (req, res) => {
    console.log("updatePurchase");
    
    const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
    if(account){
      const targetId = req.params.purchase_id;
      
      const targetPurchase = await db.Purchase.findOne({ where: { purchase_id: targetId, department_id: account.department_id } });

    if (targetPurchase) {
      const { 
        purchase_name, 
        number_units, 
        unit_price, 
        demand, 
        detail_item, 
        
        year,

        had_been, 
        usable, 
        unusable, 

        new_item, 
        explain_new, 
        add,
        replace,
        research,
        explain_research, 
        teach,
        explain_teach, 
        
        reason_purchase,
      } = req.body;

      var total_price = unit_price * demand;
      /*
        status_purchase

        level_1_pd = level 1 pending
        level_1_ed = level 1 edited

        level_2_cf = level 2 confirm
        level_2_rj = level 2 reject
        level_2_ed = level 2 edited

        level_3_cf = level 3 confirm
        level_3_rj = level 3 reject
      */
     
      //account.role == 'level_1', 'level_2', 'level_3', 'level_4'
      let status_purchase = account.role+'_ed'; //level_1_ed
      
      var update_purchase = account.account_id;
      
      await targetPurchase.update({
          purchase_name, 
          number_units, 
          unit_price, 
          total_price,
          demand, 
          detail_item, 
          year,
          had_been, usable, 
          unusable, new_item,
          explain_new, 
          explain_research, 
          explain_teach, 
          add, replace, teach, research,
          reason_purchase, 
          status_purchase,
          update_purchase,
      });
      res.status(200).send({ message: `Updated ${targetId}` });
    } else {
      res.status(404).send({ message: `Purchase Not Found` });
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
}

//Spec
/*
  /createSpec/:account_id
  
  account_id = account_id ของคนที่ใช้ api นี้

  รูปแบบการตั้ง spec_id 
    SP<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร>
    SPCMM20210119001
*/
const createSpec = async (req, res) => {
  console.log("createSpec");
    
  const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
  if(account){
    const { purchase_id, file_spec, reason_spec } = req.body;
    const department_id = account.department_id;
      
    const targetPurchase = await db.Purchase.findOne({ where: { purchase_id: purchase_id, department_id: department_id } });

    if(targetPurchase){
      const targetSpec = await db.Spec.findOne({ where: { purchase_id: purchase_id } });
    
      if(targetSpec){
        res.status(400).send({message: "Spec exist"});
      } else {
        const pid_count = await db.Spec.count({ where: { department_id: department_id } });
        const pid_year = new Date().getFullYear();
        const pid_month = new Date().getMonth();
        const pid_day = new Date().getDate();
        //SP<ชื่อภาควิชา><ปี><เดือน><วัน><ลำดับเอกสาร>
        let spec_id = `SP${department_id+pid_year+('0'+pid_month).slice(-2)+('0'+pid_day).slice(-2)+('00'+(pid_count+1)).slice(-3)}`
  
        const create_spec = account.account_id;
  
        try{
            const newSpec = await db.Spec.create({ spec_id, purchase_id, department_id, file_spec, reason_spec, create_spec });
            res.status(200).send(newSpec);
        }catch(err){
            res.status(400).send(err);
        }
      }
    } else {
      res.status(404).send({message: "Purchase Not Found"});
    }
    
  } else {
    res.status(404).send({message: "User Not Found"});
  }
}

/*
  /updateSpec/:account_id/:spec_id
  
  account_id = account_id ของคนที่ใช้ api นี้
  spec_id = id ของ spec นี้
*/
const updateSpec = async (req, res) => {
    console.log("updateSpec");
    
    const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
    if(account){

      const { account_id, spec_id } = req.params;
      const { purchase_id, file_spec, reason_spec } = req.body;
      
      const targetSpec = await db.Spec.findOne({ where: { spec_id: spec_id } });

    if (targetSpec) {
      const editedexistaSpec = await db.Spec.findOne({ where: { purchase_id: purchase_id } });

      if(editedexistaSpec && editedexistaSpec.spec_id != targetSpec.spec_id){
        res.status(400).send({message: "Spec exist"});
      } else {
        const update_spec = account.account_id;
        await targetSpec.update({
            purchase_id,
            file_spec, 
            reason_spec, 
            update_spec
        });
        res.status(200).send({ message: `Updated ${targetSpec.spec_id}` });
      }
    } else {
      res.status(404).send({ message: `Not Found` });
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
}

/*
  /deletePurchases/:account_id/:purchase_id

  account_id = account_id ของคนที่ใช้ api นี้
  purchase_id = id ของ purchase

  *department_id ของ account ของคนที่มาลบต้องเป็น ตัวเดียวกันกับใน purchase

  function นี้จะลบทั้ง 
    purchase record, 
    quotation record, 
    quotation_details record, 
    spec record, 
    comment record, 
    rank_purchase record 
  ของ purchase_id นี้ออกไปเลย
*/
const deletePurchases = async (req, res) => {
  const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
  if(account){
    const targetId = req.params.purchase_id;
    const targetPurchase = await db.Purchase.findOne({ where: { purchase_id: targetId, department_id: account.department_id } });
    
    if (targetPurchase) {
      await targetPurchase.destroy();
      
      const d_quot = await db.Quotation.destroy({where: {purchase_id: targetId}, truncate: true});
      await db.Quotation_Details.destroy({where: {from_quotation_id: d_quot.quotation_id}, truncate: true});
      await db.Spec.destroy({where: {purchase_id: targetId}, truncate: true});
      await db.Comment.destroy({where: {purchase_id: targetId}, truncate: true});
      await db.RankPurchase.destroy({where: {purchase_id: targetId}, truncate: true});

      res.status(200).send({message: "delete Purchase Success"});
    } else {
      res.status(404).send({message: "Not Found Purchase "});
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
};

/*
  /getPurchase/:account_id/:purchase_id
  รับค่า purchase 1 ค่า

  account_id = account_id ของคนที่ใช้ api นี้
  purchase_id = id ของ purchase

  *department_id ของ account ของคนที่มาใช้ต้องเป็น ตัวเดียวกันกับใน purchase

  รวม comp ต่างๆ ไว้ใน function นี้
  - purchase
  - quotation, quotation_details
  - spec
*/
const getPurchase = async (req, res) => {
  console.log("Get Data Purchase");
  const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
  if(account){
    if(account.role != "level_3" && account.role != "admin"){
      const purchase = await db.Purchase.findOne({ where: { purchase_id: req.params.purchase_id, department_id: account.department_id } });
      if (purchase) {
        const quotation = await db.Quotation.findOne({ where: { purchase_id: req.params.purchase_id } });
        const quotation_details = quotation ? await db.Quotation_Details.findAll({ where: { from_quotation_id: quotation.quotation_id } }) : null;
        const spec = await db.Spec.findOne({ where: { purchase_id: req.params.purchase_id } });
        const comments = 
          purchase.status_purchase === "level_2_rj" ? await db.Comment.findAll({ where: { purchase_id: req.params.purchase_id, reason_confirm_level3: null, reason_confirm_level4: null } })
          : 
          purchase.status_purchase === "level_3_rj" ? await db.Comment.findAll({ where: { purchase_id: req.params.purchase_id, reason_confirm_level2: null, reason_confirm_level4: null } })
          : null;
        const result = {purchase, quotation, quotation_details, spec, comments};
        res.status(200).send(result);
      } else {
        res.status(404).send({ message: "Something wrong" });
      }
    } else {
      const purchase = await db.Purchase.findOne({ where: { purchase_id: req.params.purchase_id } });
      if (purchase) {
        const quotation = await db.Quotation.findOne({ where: { purchase_id: req.params.purchase_id } });
        const quotation_details = quotation ? await db.Quotation_Details.findAll({ where: { from_quotation_id: quotation.quotation_id } }) : null;
        const spec = await db.Spec.findOne({ where: { purchase_id: req.params.purchase_id } });
        const comments = await db.Comment.findAll({ where: { purchase_id: req.params.purchase_id } });
        const result = {purchase, quotation, quotation_details, spec, comments};
        res.status(200).send(result);
      } else {
        res.status(404).send({ message: "Something wrong" });
      }
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
};

/*
  /getPurchases/:account_id
  ดึงค่า purchase ทั้งหมดใน department ของผู้ใช้

  account_id = account_id ของคนที่ใช้ api นี้

*/
const getPurchases = async (req, res) => {
  console.log("Get Data Purchases");
  const account = await db.User.findOne({ where: { account_id: req.params.account_id } });
  if(account){
    if(account.role != "level_3" && account.role != "level_4" && account.role != "admin"){
      const targetId = await db.Purchase.findAll({ where: { department_id: account.department_id } });
      if (targetId) {
        res.status(200).send(targetId);
      } else {
        res.status(404).send({ message: "Not Found Any Purchase" });
      }
    } else {
      const targetId = await db.Purchase.findAll({  });
      if (targetId) {
        res.status(200).send(targetId);
      } else {
        res.status(404).send({ message: "Not Found Any Purchase" });
      }
    }
  } else {
    res.status(404).send({message: "User Not Found"});
  }
};

//PDF
const uploadPDF = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send({ message: "No files were uploaded." });
  }

  let pdf = prompt("input file");
  let fileExtension = (pdf.split(".").slice(-1)[0] === "pdf")
  let filePath = `/${new Date().getTime()}.${fileExtension}`;

  image.mv(`files/${filePath}`);

  res.status(201).send({ message: "Save File Success" });
};

/*
    /getExcel/:department_id/:year

    department_id = ชื่อภาควิชา
    year = ปีการศึกษา
*/
const getExcel = async (req, res) =>{
  console.log("get Excel");
  const {department_id, year} = req.params;
  try {
      //const params = await req.body
      //let list = []
      let { list } = await db.Purchase.findAll({ where: {department_id: department_id, year: year, status_purchase: "level_3_cf"}})
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
  createQuotation,
  updateQuotation,
  createPurchase,
  updatePurchase,
  createSpec,
  updateSpec,
  deletePurchases,
  getPurchase,
  getPurchases,
  getExcel,
  uploadPDF
};