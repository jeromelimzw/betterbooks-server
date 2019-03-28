const express = require("express");
const routerUser = express.Router();
const User = require("../models/user");

//get all users with books populated (an array of objects)
routerUser.route("/").get(async (req, res) => {
  try {
    const allUsers = await User.find().populate("books", "title");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//get a single user by username with books populated (an object)
routerUser.route("/:username").get(async (req, res) => {
  const { username } = req.params;
  try {
    const oneUser = await User.findOne({ username }).populate("books", [
      "title",
      "authors",
      "imageUrl",
      "description",
      "genres"
    ]);
    res.status(200).json(oneUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = routerUser;
