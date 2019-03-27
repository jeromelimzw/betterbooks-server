const app = require("./app");
const mongoose = require("mongoose");
const port = 8080;
const mongoURI = "mongodb://localhost/betterbooks";
const seedData = require("./data/seed");

mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;

db.on("error", err => {
  console.error("Unable to connect to mongoDB database", err);
});

db.on("connected", db.dropDatabase);

db.on("connected", err => {
  console.log("Successfully connected to the mongoDB database");
});

db.once("connected", () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    seedData();
  });
});
