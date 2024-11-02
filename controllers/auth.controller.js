const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken.js");
module.exports.registerUser = async function (req, res) {
  try {
    let { fullname, email, password, contact } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const buffer = req.file.buffer;
    let user = await userModel.findOne({ email: email });

    if (user)
      return res
        .status(401)
        .send("user with this email already register ,please login email");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            image: buffer,
            fullname,
            email,
            password: hash,
            contact,
          });
          let token = generateToken(user);
          res.cookie("token", token);
          res.send("user creted successfully");
        }
      });
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (!user) return res.send("email or password incorrect");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      return res.redirect("/shop");
    } else {
      return res.send("email or password incorrect");
    }
  });
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};
