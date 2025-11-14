const mongoose = require("mongoose");
const Listing = require("../models/listing"); // adjust path if needed
const { data: listings } = require("./data"); // destructure from exported object

mongoose
  .connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("Connected to Atlas DB"))
  .catch((err) => console.log(err));

const seedDB = async () => {
  try {
    await Listing.deleteMany({}); // clear old data
    await Listing.insertMany(listings); // insert new data
    console.log("Database seeded!");
  } catch (err) {
    console.log("Error seeding DB:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

