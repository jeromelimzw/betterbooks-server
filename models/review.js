const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  review: { type: String },
  score: { type: Number, required: [true, "Score is required"] },
  time: { type: Number, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
