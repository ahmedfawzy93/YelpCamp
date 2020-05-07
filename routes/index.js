var express 	= require("express"),
	router 		= express.Router(),
	User		= require("../models/user"),
	passport	= require("passport"),
	middleware	= require("../middleware");

// Root Route
router.get("/", function(req, res){
    res.render("landing");
});


// Authentication Routes
// SignUp Routes
// New Route
router.get("/register", function(req, res){
    res.render("register");
});
// Create Route
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){    
           		req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("/campgrounds");
        	});
        }
    });       
});

// Login Routes
// New Route
router.get("/login", function (req, res){
    res.render("login");
});
// Login Logic Route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

// Logout Route
router.get("/logout", function (req, res){
    req.logout();   
   	req.flash("success", "Successfully logged you out");
	res.redirect("/");
});

module.exports = router;