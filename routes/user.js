const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveredirectUrl} = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const { route } = require("./listing.js");
const userControllers = require("../controllers/users.js");


router.route("/signup")
    .get(userControllers.renderSignupForm)
    .post(wrapAsync(userControllers.signup));

router.route("/login")
    .get(userControllers.renderLoginForm)
    .post(saveredirectUrl,  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userControllers.login);

router.get("/logout", userControllers.logout);

module.exports = router;