const Schema = require("mongoose").Schema;

const reviewSchema = new Schema({
  reviews: { type: [String] },
  score: { type: Number, required: [true, "Score is required"] },
  ISBN13: { type: String }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
