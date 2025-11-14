require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");

// Connect to MongoDB
mongoose.connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log("Connected to Atlas DB");
    seedDB(); // run seeding only after successful connection
  })
  .catch(err => console.log("Connection error:", err));

// Seed function
const seedDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing listings removed");

    await Listing.insertMany(data);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};
