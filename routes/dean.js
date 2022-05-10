const express = require("express");
const router = express.Router();
const Controller = require("../controllers/dean");
const Control = require("../controllers/professer")
const Control_begin = require("../controllers/beginner");

router.post("/createConfirm/:account_id/:department/:year", Controller.createConfirm);

router.post("/createComment/:account_id/:purchase_id", Control.createComment);
router.get("/getPurchase/:account_id/:purchase_id", Control_begin.getPurchase);
router.get("/getPurchases/:account_id", Control_begin.getPurchases);

module.exports = router;