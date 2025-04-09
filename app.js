const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); 
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const Review = require("./models/review.js");
const { render } = require("ejs");
 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
    console.log("connected to DB");   
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}; 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));





app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing")
// })


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details
        .map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details
        .map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// index route
app.get("/listing",async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
})


//New route
app.get("/listing/new", wrapAsync((req, res) => {
    res.render("listing/new.ejs");
}));

// Show Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

// Create Route
app.post("/listing",validateListing, wrapAsync(async (req, res, next) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");

    
}));

//Edit routre
app.get("/listing/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

//Update route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//Delete Route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
    
}));



//Reviews 
// post review Routes
app.post("/listing/:id/reviews", validateReview, wrapAsync( async(req, res) => { 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing.id}`);  
}));


//Delete Review Route

app.delete("/listing/:id/reviews/:reviewId", wrapAsync( async(req, res) => {
    let { id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`)
}))



















app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = " Some thing worng"} = err;
    // res.status(statusCode).send(message);
        res.status(statusCode).render("error.ejs", {err})
})












app.listen(8080, () => {
    console.log("server is listening to port 8080");
    
});
