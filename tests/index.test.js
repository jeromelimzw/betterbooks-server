const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/user");

const route = (params = "") => {
  return `/${params}`;
};

describe("[AUTH] checks", () => {
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
    const user = new User({
      username: "coolkid",
      email: "ellise@champ.com",
      password: "password123",
      lastname: "Champs",
      firstname: "Elyse",
      avatarimgURL: "https://semantic-ui.com/images/avatar2/large/elyse.png"
    });
    await user.save();
  });

  afterEach(async () => {
    await db.dropCollection("users");
  });

  afterAll(async () => {
    mongoose.disconnect();
    await mongod.stop();
  });

  describe("[SIGNUP] checks", () => {
    test("signup is successful with appropriate credentials", async () => {
      const res = await request(app)
        .post(route("register"))
        .send({
          username: "bookgirl",
          email: "sally@meredith.com",
          password: "password123",
          lastname: "Sally",
          firstname: "Meredith",
          avatarimgURL: "https://semantic-ui.com/images/avatar/large/jenny.jpg"
        })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          username: "bookgirl",
          email: "sally@meredith.com",
          password: expect.any(String),
          lastname: "Sally",
          firstname: "Meredith",
          avatarimgURL: "https://semantic-ui.com/images/avatar/large/jenny.jpg",
          _id: expect.any(String)
        })
      );
    });
    test("signup is unsuccessful with previously registered username", async () => {
      const res = await request(app)
        .post(route("register"))

        .send({
          username: "coolkid",
          email: "sally@meredith.com",
          password: "password123",
          lastname: "Sally",
          firstname: "Meredith",
          avatarimgURL: "https://semantic-ui.com/images/avatar/large/jenny.jpg"
        });

      expect(res.status).toEqual(401);
      expect(res.text).toEqual("username already taken");
    });
  });

  describe("[LOGIN] checks", () => {
    test("login is successfully executed with correct credentials", async () => {
      const res = await request(app)
        .post(route("login"))
        .set("Origin", "http://localhost:3006")
        .send({
          username: "coolkid",
          password: "password123"
        });

      expect(res.status).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          username: "coolkid",
          email: "ellise@champ.com",
          lastname: "Champs",
          firstname: "Elyse",
          _id: expect.any(String),
          avatarimgURL: "https://semantic-ui.com/images/avatar2/large/elyse.png"
        })
      );
    });

    test("login is rejected with correct credentials but wrong password", async () => {
      const res = await request(app)
        .post(route("login"))
        .send({
          username: "coolkid",
          password: "notthepassword"
        });

      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Illegal entry attempt detected");
    });
  });
  describe("[LOGOUT] checks", () => {
    test("logout is successfully executed", async () => {
      const res = await request(app).get(route("logout"));

      expect(res.status).toEqual(200);
      expect(res.text).toEqual("You have been logged out. See you again");
    });
  });
});
