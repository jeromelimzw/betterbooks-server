const { Book } = require("../models/book");
const { Review } = require("../models/book");
const User = require("../models/user");

const seedOneData = async (userdata, reviewdata, bookdata) => {
  const user = new User(userdata);
  const review = new Review(reviewdata);
  const book = new Book(bookdata);

  review.user = user;
  user.books = [book];
  book.reviews = [review];

  await user.save();
  await review.save();
  await book.save();
};

const userdata = [
  {
    username: "john2",
    email: "john@smith.com",
    password: "$2b$10$djWH9gUh9l2C8iY5YcIkGOORXMxMjdezs2yEKttdGYw8KxwPcKB16",
    lastname: "Smith",
    firstname: "John",
    avatarimgURL:
      "http://www.st.buu.ac.th/calendar/semantic/examples/assets/images/avatar/tom.jpg"
  }
];
const reviewdata = [
  {
    time: "1553658587872",
    review: "it was alright",
    score: 5
  }
];
const bookdata = [
  {
    authors: ["Jasper Fforde"],
    genres: ["Fiction"],
    language: "en",
    publisher: "Hachette UK",
    description:
      "***Number One bestselling author Jasper Fforde's new standalone, Early Riser, is available to order now!*** Imagine a black and white world where colour is a commodity . . . Hundreds of years in the future, after the Something that Happened, the world is an alarmingly different place. Life is lived according to The Rulebook and social hierarchy is determined by your perception of colour. Eddie Russett is an above average Red who dreams of moving up the ladder by marriage to Constance Oxblood. Until he is sent to the Outer Fringes where he meets Jane - a lowly Grey with an uncontrollable temper and a desire to see him killed. For Eddie, it's love at first sight. But his infatuation will lead him to discover that all is not as it seems in a world where everything that looks black and white is really shades of grey ... If George Orwell had tripped over a paint pot or Douglas Adams favoured colour swatches instead of towels, neither of them would have come up with anything as eccentrically brilliant as Shades of Grey.",
    title: "Shades of Grey1",
    type: "BOOK",
    publishedDate: "2010-10-07",
    ISBN13: "9781848945845",
    imageUrl:
      "http://books.google.com/books/content?id=aSlaRRPEyqkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
  }
];

const seedData = async () => {
  await userdata.map(async user => {
    return await reviewdata.map(async review => {
      return await bookdata.map(async book => {
        await seedOneData(user, review, book);
      });
    });
  });
};

module.exports = seedData;

// const seedData = async () => {
//   const user1 = new User({
//     books: [],
//     username: "john2",
//     email: "john@smith.com",
//     password: "$2b$10$djWH9gUh9l2C8iY5YcIkGOORXMxMjdezs2yEKttdGYw8KxwPcKB16",
//     lastname: "Smith",
//     firstname: "John",
//     avatarimgURL:
//       "http://www.st.buu.ac.th/calendar/semantic/examples/assets/images/avatar/tom.jpg",
//     __v: 0
//   });
//   const review1 = new Review({
//     time: "1553658587872",
//     review: "it was alright",
//     score: 5,
//     user: user1
//   });
//   const book1 = new Book({
//     authors: ["Jasper Fforde"],
//     genres: ["Fiction"],
//     language: "en",
//     publisher: "Hachette UK",
//     description:
//       "***Number One bestselling author Jasper Fforde's new standalone, Early Riser, is available to order now!*** Imagine a black and white world where colour is a commodity . . . Hundreds of years in the future, after the Something that Happened, the world is an alarmingly different place. Life is lived according to The Rulebook and social hierarchy is determined by your perception of colour. Eddie Russett is an above average Red who dreams of moving up the ladder by marriage to Constance Oxblood. Until he is sent to the Outer Fringes where he meets Jane - a lowly Grey with an uncontrollable temper and a desire to see him killed. For Eddie, it's love at first sight. But his infatuation will lead him to discover that all is not as it seems in a world where everything that looks black and white is really shades of grey ... If George Orwell had tripped over a paint pot or Douglas Adams favoured colour swatches instead of towels, neither of them would have come up with anything as eccentrically brilliant as Shades of Grey.",
//     _id: "5c9ae36a952f7e1624fccc4d",
//     title: "Shades of Grey1",
//     type: "BOOK",
//     publishedDate: "2010-10-07",
//     ISBN13: "9781848945845",
//     imageUrl:
//       "http://books.google.com/books/content?id=aSlaRRPEyqkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
//     reviews: [review1]
//   });

//   review1.user = user1;
//   user1.books = [book1];

//   await user1.save();
//   await review1.save();
//   await book1.save();
// };
