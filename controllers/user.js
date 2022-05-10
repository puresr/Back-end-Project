const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//login
const login = async (req, res) => {
    const { username, password } = req.body;
    const targetUser = await db.User.findOne({ where: { username: username } });
    
    if (!targetUser) {
      res.status(400).send({ message: "Username or Password is wrong" });
    } else {
      var hash = bcrypt.hashSync(targetUser.password);
      const isCorrectPassword = bcrypt.compareSync(password, hash);
  
      if (isCorrectPassword) {
        const payload = {
          id: targetUser.id,
          name: targetUser.username,
        }; 
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: Number(process.env.TIME_TOKEN),
        });
        res.status(200).send({
          message: "Login Successful",
          token: token,
        });
      } else {
        res.status(400).send({ message: "Username or Password is wrong" });
      }
    }
  };

  //logout
  const logout = () => {
    localStorage.removeItem('user');
    history.push('/login');
  }
  module.exports = { login, logout };