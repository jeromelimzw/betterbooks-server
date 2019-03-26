const express = require("express");
const router = express.Router();
const protectedRouter = express.Router();
const Book = require("../models/book");

//get all books regardless
router.route("/").get(async (req, res) => {
  try {
    await Book.init();
    const allBooks = await Book.find().populate("reviews");
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//get a single book by id and fully populated reviews
router.route("/:_id").get(async (req, res) => {
  const { _id } = req.params;
  try {
    const oneBook = await Book.findOne({ _id }).populate("reviews");
    return res.status(200).json(oneBook);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//add a book if not already in the shared bookshelf
protectedRouter.route("/").post(async (req, res) => {
  const book = new Book(req.body);
  try {
    await Book.init();
    await book.save();
    return res.status(200).send("book saved");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//delete a book by id
protectedRouter.route("/:_id").delete(async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id) {
      return res.status(404).send("id is required");
    }
    const book = await Book.find({ _id });
    if (!book) {
      return res.status(404).send("book not found");
    }
    await Book.findByIdAndDelete(_id);
    return res.status(200).send(book);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = { router, protectedRouter };
