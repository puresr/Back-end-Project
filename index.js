require("dotenv").config();
require("./config/passport");

const http = require('http');
const express = require("express");
const app = express();
const server = http.createServer(app);
const db = require('./models')
const cors = require("cors");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user");
const professionRoutes = require("./routes/professer")
const beginnerRoutes = require("./routes/beginner");
const seniorRoutes = require("./routes/senior");
const deanRoutes = require("./routes/dean");
const adminRoutes = require("./routes/admin"); 

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use("/users", userRoutes);
app.use("/beginner", beginnerRoutes);
app.use("/senior", seniorRoutes);
app.use("/profession", professionRoutes);
app.use("/dean", deanRoutes);
app.use("/admin", adminRoutes);

// sever listening
db.sequelize.sync({force: false, alter: false}).then(() => { //ปิดการ drop database ทุกครั้งที่เปิดโปรแกรมโดยเปลี่ยน force: false
    app.listen(port, () => {
        console.log(`Sever running on port ${port}`,);
    })
})
