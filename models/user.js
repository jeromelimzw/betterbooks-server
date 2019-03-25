const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: true, index: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  avatarimgURL: { type: String, required: true }
});

userSchema.pre("save", function async(next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  bcryt
    .hash(this.password, saltRounds)
    .then(hash => {
      this.password = hash;
      return next();
    })
    .catch(err => {
      return next(err);
    });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
