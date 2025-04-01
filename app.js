const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
 
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
app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
})

// Show Route
app.get("/listing/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
})


app.post("/listing", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
    
})

//Edit routre
app.get("/listing/:id/edit", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
})

//Update route
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
})

//Delete Route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
    
})















app.listen(8080, () => {
    console.log("server is listening to port 8080");
    
});
