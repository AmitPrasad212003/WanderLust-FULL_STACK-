const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,  validateReview, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");
const reviewControllers = require("../controllers/review.js");




//Reviews 
// post review Routes
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewControllers.createReview));


//Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( reviewControllers.destroyReview))


module.exports = router;