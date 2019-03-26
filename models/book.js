const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true, index: { unique: true } },
  authors: { type: [String], required: true },
  type: { type: String, required: true },
  publishedDate: { type: String, required: true },
  genres: { type: [String], required: true, default: ["General"] },
  language: { type: String, default: "en" },
  publisher: { type: String, default: "General Publishers" },
  ISBN13: { type: String },
  ISBN10: { type: String },
  description: { type: String, default: "no description provided" },
  imageUrl: {
    type: String,
    required: true
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
