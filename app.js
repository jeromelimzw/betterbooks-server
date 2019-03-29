const express = require("express");
const cors = require("cors");
const app = express();
//const morgan = require("morgan");
const helmet = require("helmet");

const router = require("./routes/books");
const routerUser = require("./routes/users");

const whitelist = ["https://betterbooks-client.herokuapp.com/"];

var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

//app.use(morgan("tiny"));
app.use(helmet());

app.use("/", require("./routes/index"));
app.use("/api/v1/books", router);
app.use("/api/v1/users", routerUser);

module.exports = app;
