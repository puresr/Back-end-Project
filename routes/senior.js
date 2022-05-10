const express = require("express");
const router = express.Router();
const Controller = require("../controllers/beginner");
const Controllers = require("../controllers/senior");
const Controller_prof = require("../controllers/professer");

//beginner.js (lv.3) part
router.post("/createQuotation/:account_id", Controller.createQuotation);
router.post("/createPurchase/:account_id", Controller.createPurchase);
router.post("/createSpec/:account_id", Controller.createSpec);
router.patch("/updateQuotation/:account_id/:quotation_id", Controller.updateQuotation); 
router.patch("/updatePurchase/:account_id/:purchase_id", Controller.updatePurchase);
router.patch("/updateSpec/:account_id/:spec_id", Controller.updateSpec);
router.delete("/deletePurchases/:account_id/:purchase_id", Controller.deletePurchases);
router.get("/getPurchase/:account_id/:purchase_id", Controller.getPurchase);
router.get("/getPurchases/:account_id", Controller.getPurchases);

//senior.js part
router.post("/createRankDepartment/:from_department/:year", Controller_prof.createRankDepartment);
router.patch("/updateRankDepartment/:from_department/:year", Controller_prof.updateRankDepartment);
router.patch("/statusPrivate/:purchase_id", Controllers.statusPrivate);

//professer.js part
router.post("/createComment/:account_id/:purchase_id", Controller_prof.createComment);
router.get("/getTotalprice/:year", Controller_prof.getTotalprice);


module.exports = router;