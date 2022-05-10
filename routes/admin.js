const express = require("express");
const router = express.Router();
const Controller =require("../controllers/admin");

router.post("/createUser", Controller.createUser);
router.patch("/updateUser/:id", Controller.updateUser);
router.delete("/deleteUser/:id", Controller.deleteUser);
router.get("/getUsers", Controller.getUsers);

module.exports = router;