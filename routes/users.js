const express = require("express");
const routerUser = express.Router();
const User = require("../models/user");

//get all users with books populated
routerUser.route("/").get(async (req, res) => {
  try {
    const allUsers = await User.find().populate("books", "title");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

routerUser.route("/:_id").get(async (req, res) => {
  try {
    const oneUser = await User.findOne({ _id }).populate("books", [
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
