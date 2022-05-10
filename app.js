// require('dotenv').config();
// // require('./config/database').connect();
// const jwt = require("jsonwebtoken");
// const express = require('express');

// const app = express();

// app.use(express.json());

// // Login
// app.post("/login", async (req, res) => {
//     // const dataReq = req.body
//     // console.log('Request to get data');
//     // fs.readFile('...', 'utf8', (err, data) => { 
        
//     //     let objList = JSON.parse(data);
//     //     console.log(objList)
//     //     if(err){
//     //         console.log("error", err);
//     //         return res.status(400).json({ msg: 'Login error' })
//     //     }
            
//     //     if(!objList.some(ele => ele.user === dataReq.user && ele.pass === dataReq.pass )){
//     //         console.log("error", err);
//     //         return res.status(400).json({ msg: 'Username or Password is worng' })
//     //     }
//     //     return res.status(200).json({msg: "Login Success"})
//     // });
//     const { username, password } = req.body;
//     const targetUser = await db.User.findOne({ where: { username: username } });
//     if (!targetUser) {
//         res.status(400).send({ message: "Username or Password is wrong" });
//     } else {
//         const isCorrectPassword = bcryptjs.compareSync(
//         password,
//         targetUser.password
//         );

//         if (isCorrectPassword) {
//             const payload = {
//             id: targetUser.id,
//             name: targetUser.name,
//         };
//         const token = jwt.sign(payload, "codecamp", { expiresIn: 3600 });
//         res.status(200).send({
//             token: token,
//             message: "Login Successful",
//         });
//         } else {
//         res.status(400).send({ message: "Username or Password is wrong" });
//         }
//     }
// })

// // Update Namelist
// app.post('/updatenamelist', (req,res) => {

//     const dataReq = req.body
//     console.log('Request to write data with data: ', dataReq);
//     fs.readFile('...', 'utf8', (err, data) => {    
        
//         if(err){
//             console.log('Error while read data: ', err);
//             return res.status(400).json({ msg: 'error' })
//         }

//         console.log('Result from read data with: ', data);
//         let objList = JSON.parse(data);
//         if(objList.some(ele => ele.user === dataReq.user)){
//             console.log('user already exists');
//             return res.status(403).json({ msg: 'error have a user' })
//         }

//         let newDataReq = {id:objList.length + 1,...dataReq}
//         objList.push(newDataReq);
//         let json = JSON.stringify(objList);
//         console.log('Write data to file with: ', json);
//         fs.writeFile('data.json', json, 'utf8',function(err) {
//             if (err) throw err;
//         });
//         return res.status(200).json({ msg: 'success' });
        
//     });


// });

// module.exports = app;