const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");



router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//New route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))


//Edit routre
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editedListing));



//below comment code , for my understanding 


// index route
// router.get("/", wrapAsync(listingController.index));


// //New route
// router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// //Edit routre
// router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editedListing));

//Update route
// router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;