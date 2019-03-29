const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  console.log(req.cookies.is_old);
  if (!req.cookies.token) {
    return res.status(401).end("You shall not pass...");
  }
  try {
    const { token } = req.cookies;
    const decoded = await jwt.verify(token, process.env.SECRET);
    const username = decoded.user;
    console.log(username);
    const user = await User.findOne({ username });
    user === null ? res.status(401).send("unauthorized entry") : next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
