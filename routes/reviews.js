const express = require("express");
const routerRev = express.Router();
const protectedRouterRev = express.Router();
const Review = require("../models/review");
const Book = require("../models/book");

routerRev.route("/").get(async (req, res) => {
  try {
    await Review.init();
    const allReviews = await Review.find()
      .populate("user", "username")
      .populate("book", "title");
    return res.status(200).json(allReviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//get reviews from book id
routerRev.route("/:_id").get(async (req, res) => {
  const { _id } = req.params;
  try {
    const allReviews = await Review.find()
      .populate("user", ["username", "avatarimgURL"])
      .populate("book", "title");
    console.log(allReviews);

    const filteredReviews = allReviews.filter(
      a => a.book._id.toString() === _id.toString()
    );
    return res.status(200).json(filteredReviews);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

protectedRouterRev.route("/").post(async (req, res) => {
  const review = new Review(req.body);
  try {
    await Review.init();
    await review.save();
    return res.status(200).send("review saved");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = { routerRev, protectedRouterRev };
