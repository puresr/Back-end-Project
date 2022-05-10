const express = require("express");
const router = express.Router();
const Controller =require("../controllers/professer");
const Control_begin = require("../controllers/beginner");

router.post("/createComment/:account_id/:purchase_id", Controller.createComment);
router.post("/createRankDepartment/:from_department/:year", Controller.createRankDepartment);
router.patch("/updateRankDepartment/:from_department/:year", Controller.updateRankDepartment);
router.get("/getPurchase/:account_id/:purchase_id", Control_begin.getPurchase);
router.get("/getPurchases/:account_id", Control_begin.getPurchases);

router.get("/getTotalprice/:year", Controller.getTotalprice); //
router.get("/excel/:from_department/:year", Controller.getExcel);

module.exports = router;