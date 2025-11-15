const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const { route } = require("./listing.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "welcome to Wanderlust!");
        res.redirect("/listing")
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }  
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login",  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async(req, res) => {
    req.flash("success","welcome back to wanderlust! you are logged in!");
    res.redirect("/listing");
});


module.exports = router;