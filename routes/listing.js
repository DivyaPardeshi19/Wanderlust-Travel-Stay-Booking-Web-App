const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
     isLoggedIn,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createListing)
);

//New Route
router.get("/new", 
    isLoggedIn, listingController.renderNewForm);


//  SEARCH BY COUNTRY
router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.q;
  let listings = [];

  if (query && query.trim() !== "") {
    listings = await Listing.find({
      country: { $regex: query, $options: "i" } // search by country (case-insensitive)
    });
  } else {
    listings = await Listing.find({});
  }

  if (listings.length === 0) {
    req.flash("error", `No listings found in "${query}"`);
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings: listings });
}));


// SHOW, UPDATE, DELETE routes
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));


 //Edit Route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;