const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const router = require("./routes/books");
const routerUser = require("./routes/users");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const isDev = process.env.NODE_ENV !== "production";

const whitelist = [
  "https://betterbooks-client.herokuapp.com",
  "https://betterbooks.netlify.com"
];

if (isDev) {
  whitelist.push("http://localhost:3006");
}

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("tiny"));
app.use(helmet());

app.use("/", require("./routes/index"));
app.use("/api/v1/books", router);
app.use("/api/v1/users", routerUser);

module.exports = app;
