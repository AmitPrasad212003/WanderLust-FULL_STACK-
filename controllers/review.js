const Review = require("../models/review.js"); 
const Listing = require("../models/listing.js");

module.exports.createReview = async(req, res, next) => { 
    try {
        let listing = await Listing.findById(req.params.id);
        if(!listing){
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");
        res.redirect(`/listing/${listing.id}`);
    } catch (err) {
        next(err);
    }
};


module.exports.destroyReview = async(req, res, next) => {
    try {
        let { id, reviewId} = req.params;
        
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing not found");
            return res.redirect("/listing");
        }
        
        let review = await Review.findById(reviewId);
        if(!review){
            req.flash("error", "Review not found");
            return res.redirect(`/listing/${id}`);
        }
        
        await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        next(err);
    }
};
