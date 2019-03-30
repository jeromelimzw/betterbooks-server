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
router.route("/register").post(async (req, res) => {
  const { username } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(401).send("username already taken");
    } else {
      const user = new User(req.body);
      await user.save();
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//verify a login and set cookie as jwt if ok and deliver payload userinfo
router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (await isAuthenticated(username, password)) {
      const payload = { user: user.username };
      const localstorage = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        _id: user._id,
        username: user.username,
        avatarimgURL: user.avatarimgURL
      };
      const token = await jwt.sign(payload, process.env.SECRET, {
        expiresIn: "24h"
      });
      return res
        .status(201)
        .cookie("token", token, { httpOnly: true })
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
