const { Book } = require("../models/book");
const { Review } = require("../models/book");
const User = require("../models/user");
const userdata = require("./userSeed");
const bookdata = require("./bookSeed");
const reviewdata = require("./reviewSeed");

const seedOneData = async (
  user1data,
  user2data,
  review1data,
  review2data,
  bookdata
) => {
  const user1 = new User(user1data);
  const user2 = new User(user2data);
  const review1 = new Review(review1data);
  const review2 = new Review(review2data);
  const book = new Book(bookdata);
  try {
    review1.user = user1;
    review2.user = user2;
    user1.books = [book];
    user2.books = [book];
    book.reviews = [review1, review2];

    await user1.save();
    await user2.save();
    await review1.save();
    await review2.save();
    await book.save();
  } catch (err) {
    console.log(err.message);
  }
};

const seedData = async () => {
  await [0, 1, 2, 3].map(a => {
    return seedOneData(
      userdata[a * 2],
      userdata[a * 2 + 1],
      reviewdata[Math.round(Math.random() * 5) + 1],
      reviewdata[Math.round(Math.random() * 5) + 1],
      bookdata[a]
    );
  });
};

// const seedData = async () => {
//   await userdata.map(async user => {
//     return await reviewdata.map(async review => {
//       return await bookdata.map(async book => {
//         await seedOneData(user, review, book);
//       });
//     });
//   });
// };

module.exports = seedData;
