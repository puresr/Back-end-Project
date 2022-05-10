const express = require("express");
const router = express.Router();
const Controller = require("../controllers/beginner");

router.post("/uploadPDF", Controller.uploadPDF); //
router.post("/createQuotation/:account_id", Controller.createQuotation);
router.post("/createPurchase/:account_id", Controller.createPurchase);
router.post("/createSpec/:account_id", Controller.createSpec);
router.patch("/updateQuotation/:account_id/:quotation_id", Controller.updateQuotation); 
router.patch("/updatePurchase/:account_id/:purchase_id", Controller.updatePurchase);
router.patch("/updateSpec/:account_id/:spec_id", Controller.updateSpec);
router.delete("/deletePurchases/:account_id/:purchase_id", Controller.deletePurchases);
router.get("/getPurchase/:account_id/:purchase_id", Controller.getPurchase);
router.get("/getPurchases/:account_id", Controller.getPurchases);
router.get("/excel/:from_department_id/:year", Controller.getExcel);

module.exports = router;