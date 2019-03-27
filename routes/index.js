const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "sometimes the path is chosen for you";

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
router.route("/register").post(async (req, res) => {
  const token = req.body.token;
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    avatarimgURL: req.body.avatarimgURL,
    books: req.body.books,
    token: req.body.token
  });
  try {
    if (token === "ilikebigbooksandicannotlie") {
      await user.save();
      return res.status(200).json(user);
    }
    return res.status(400).send("wrong token");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//verify a login and set cookie as jwt if ok
router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (await isAuthenticated(username, password)) {
      const payload = { user: user.firstname };
      const localstorage = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id
      };
      const token = await jwt.sign(payload, secret, { expiresIn: "24h" });
      return res
        .status(200)
        .cookie(token)
        .send(localstorage);
    }
    throw new Error("Illegal entry attempt detected");
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

router.route("/logout").get((req, res) => {
  try {
    return res
      .status(200)
      .clearCookie()
      .send("You have been logged out. See you again");
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

module.exports = router;
