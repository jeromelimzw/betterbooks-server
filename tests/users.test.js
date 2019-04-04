const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/user");
const { Review, Book } = require("../models/book");
const seedData = require("../data/seed");
const userSeed = require("../data/userSeed");

const route = (params = "") => {
  return `/api/v1/users/${params}`;
};

describe("[GET]", () => {
  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    const mongodbUri = await mongod.getConnectionString();
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    db = mongoose.connection;
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await Book.collection.deleteMany({});
    await User.collection.deleteMany({});
    await Review.collection.deleteMany({});
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongod.stop();
  });
  xtest("should show all users with books populated", async done => {
    const allUser = await User.find();
    console.log(allUser);
    const token = jwt.sign(
      { username: foundUser.username },
      process.env.SECRET
    );

    request(app)
      .get(route())
      .set("Origin", "https://betterbooks.netlify.com")
      .set("Cookie", `token=${token}`)

      .expect(202, done);
  });
});
