if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;


main().then(() => {
    console.log("connected to DB");   
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
}; 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use((req, res, next) => {
    res.locals.mapApiKey = process.env.MAP_API_KEY;
    next();
});

const store = MongoStore.create({ 
    mongoUrl: dbURL,
    crypto : {
        secret: "mysupersecret7029"
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOption = {
    store,
    secret: "secret123",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true,
    },
}


// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });



app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // Pass query params for navbar search
    res.locals.currentFilters = req.query;

    next();

})



app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);



















app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong"} = err;
    console.error("Error:", err);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err})
})












app.listen(8080, () => {
    console.log("server is listening to port 8080");
    
});
