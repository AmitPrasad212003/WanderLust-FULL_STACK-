const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



// index route
router.get("/",async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
})


//New route
router.get("/new", isLoggedIn, wrapAsync((req, res) => {
    res.render("listing/new.ejs");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exits");
        res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
}));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");

    
}));

//Edit routre
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for does not exits");
        res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { listing });
}));

//Update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
    
}));

module.exports = router;