const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");

const { router, protectedRouter } = require("./routes/books");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

app.use("/", require("./routes/index"));
app.use("/api/v1/books", router);
app.use("/api/v1/books", protectedRouter);

module.exports = app;
