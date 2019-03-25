const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const isAuthenticated = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  } catch {
    return false;
  }
};

router
  .route("/register")
  .post(async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      avatarimgURL: req.body.avatarimgURL
    });
    try {
      await user.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  })
  .get(async (req, res) => {
    try {
      const allUsers = await User.find();
      res.json(allUsers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

router.route("/login").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (await isAuthenticated(username, password)) {
      return res.status(200).send("You are logged in");
    }
    throw new Error("You are not authorized");
  } catch (err) {
    return res.status(401).send(err.message);
  }
});

module.exports = router;
