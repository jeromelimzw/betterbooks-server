const express = require("express");
const router = express.Router();
const { Book } = require("../models/book");
const { Review } = require("../models/book");
const User = require("../models/user");
const verifyToken = require("../middleware/auth");

//get all books regardless with populated reviews => for community page
router.route("/").get(async (req, res) => {
  try {
    const allBooks = await Book.find().populate("reviews.user", [
      "username",
      "avatarimgURL"
    ]);
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//get a single book by id with populated reviews => for detailed media page
router.route("/:_id").get(async (req, res) => {
  const { _id } = req.params;
  try {
    const oneBook = await Book.findOne({ _id }).populate("reviews.user", [
      "username",
      "avatarimgURL"
    ]);

    res.status(200).json(oneBook);
  } catch (err) {
    res.status(500).send(err.status);
  }
});

router.use(verifyToken);
//get a single book by id and add a review => for detailed media page
router.route("/:_id").post(async (req, res) => {
  const review = new Review(req.body);
  console.log(review);
  const { _id } = req.params;
  try {
    const oneBook = await Book.findOne({ _id });
    await oneBook.reviews.push(review);
    await oneBook.save();
    return res.status(200).json(oneBook);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//add a book if not already in the shared bookshelf and push to user books array if not already in user array
router.route("/").post(async (req, res) => {
  const { title, username } = req.body;
  const oldBook = await Book.findOne({ title });
  const user = await User.findOne({ username });

  try {
    if (oldBook) {
      const isOnShelf = await user.books.find(a => a.toString() === oldBook.id);
      !isOnShelf && user.books.push({ _id: oldBook._id });
    } else {
      const newbook = new Book(req.body);
      await Book.init();
      await newbook.save();
      user.books.push({ _id: newbook._id });
    }
    await user.save();

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//delete a book by id FROM USER books array
router.route("/:id").delete(async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const user = await User.findOne({ username });

  try {
    const deletebook = user.books.find(a => a._id.toString() === id.toString());
    const index = user.books.indexOf(deletebook);
    user.books.splice(index, 1);
    await user.save();

    return res.status(200).send(user.books);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
