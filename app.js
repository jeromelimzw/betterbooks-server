const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { router, protectedRouter } = require("./routes/books");
const { routerRev, protectedRouterRev } = require("./routes/reviews");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

app.use("/", require("./routes/index"));
app.use("/api/v1/books", router);
app.use("/api/v1/books", protectedRouter);
app.use("/api/v1/reviews", routerRev);
app.use("/api/v1/reviews", protectedRouterRev);

module.exports = app;
