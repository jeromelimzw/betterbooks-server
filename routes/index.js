const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  } catch {
    return false;
  }
};

// add 1 new user
router
  .route("/register")
  .post(async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      avatarimgURL: req.body.avatarimgURL,
      books: req.body.books
    });
    try {
      await user.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  })
  //get all users regardless with populated book array titles
  .get(async (req, res) => {
    try {
      const allUsers = await User.find().populate("books", "title");
      res.json(allUsers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
const secret = "sometimes the path is chosen for you";

//verify a login and set cookie as jwt if ok
router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (await isAuthenticated(username, password)) {
      const payload = { user: user.firstname };

      const token = await jwt.sign(payload, secret, { expiresIn: "24h" });
      return res
        .status(200)
        .cookie(token)
        .send(`You are logged in. Your token is ${token}`);
    }
    throw new Error("You are not authorized");
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.route("/logout").get((req, res) => {
  try {
    return res
      .status(200)
      .cookie()
      .send("You have been logged out. See you again");
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

// router.route('/').get(async (req,res)=>{
// try{
// const {token} = req.cookie;

// }catch(err){res.status(500).send(err.message)}

// })

module.exports = router;
