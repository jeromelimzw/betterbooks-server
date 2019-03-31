const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const jwt = require("jsonwebtoken");
const { Book, Review } = require("../models/book");
const User = require("../models/user");
const bookdata = require("../data/bookSeed");
const reviewdata = require("../data/reviewSeed");
const userdata = require("../data/userSeed");
jest.mock("jsonwebtoken");

const route = (params = "") => {
  const path = "/api/v1/books";
  return `${path}/${params}`;
};

describe("[BOOKS] checks", () => {
  let mongod;
  let db;

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    db = mongoose.connection;
  });
  beforeEach(async () => {
    const book1 = new Book(bookdata[0]);
    const book2 = new Book(bookdata[1]);
    const user = new User(userdata[0]);
    const review = new Review(reviewdata[0]);
    review.user = user;
    book1.reviews = [review];
    book2.reviews = [review];
    user.books = [book1, book2];
    await book1.save();
    await book2.save();
    await user.save();
    await review.save();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongod.stop();
  });

  describe("[GET] checks", () => {
    test("retrieve all records of books with reviews populated", async done => {
      const res = await request(app).get(route());
      expect(res.status).toEqual(200);
      const { title: title1, authors, reviews } = res.body[0];
      const { title: title2 } = res.body[1];
      expect(title1).toEqual("Harry Potter and the Order of the Phoenix");
      expect(title2).toEqual("The Well Of Lost Plots");
      expect(authors).toEqual(["J. K. Rowling"]);
      expect(reviews[0].review).toEqual("it was alright");
      expect(reviews[0].user.username).toEqual("john");
      done();
    });

    test("retrieve a single book with reviews populated", async done => {
      const book = await Book.findOne({
        title: "The Well Of Lost Plots"
      });
      const res = await request(app).get(route(`${book.id}`));

      expect(res.status).toEqual(200);
      const { title, authors, reviews } = res.body;
      expect(title).toEqual("The Well Of Lost Plots");
      expect(authors).toEqual(["Jasper Fforde"]);
      expect(reviews[0].score).toEqual(3);
      expect(reviews[0].review).toEqual("it was alright");
      done();
    });

    test("throws an error when querying a non existent book id", async done => {
      const res = await request(app).get(route(`123456789`));
      expect(res.status).toEqual(500);
      done();
    });
  });

  describe("[POST] checks", () => {
    test("get a book by id and add a review as a user", async done => {
      const user = await User.findOne({ firstname: "John" });
      jwt.verify.mockResolvedValueOnce({ username: user.username });
      const book = await Book.findOne({ title: "The Well Of Lost Plots" });
      const res = await request(app)
        .post(route(`${book.id}`))
        .send({ review: "this is a very long review", user, score: 9 });
      console.log(res.body);
    });
    test("throw an error when any of the review requirements are not present", () => {});
  });
});
