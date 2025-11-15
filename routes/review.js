const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateReview} = require("../middleware.js");
const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");




//Reviews 
// post review Routes
router.post("/", validateReview, wrapAsync( async(req, res) => { 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${listing.id}`);  
}));


//Delete Review Route

router.delete("/:reviewId", wrapAsync( async(req, res) => {
    let { id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`)
}))


module.exports = router;