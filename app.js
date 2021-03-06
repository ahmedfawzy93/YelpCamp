var express     			= require("express"),
    app         			= express(),
    bodyParser 				= require("body-parser"),
    mongoose   				= require("mongoose"),
	passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
	methodOverride			= require("method-override"),
	flash					= require('connect-flash'),
	Campground				= require("./models/campground"),
	Comment					= require("./models/comment"),
	User					= require("./models/user"),
	seedDB					= require("./models/seed"),
	session 				= require('express-session'),
	MongoStore 				= require('connect-mongo')(session);
 


// requiring routes
var campgroundRoutes 	= require("./routes/campgrounds"),
	commentRoutes 		= require("./routes/comments"),
	indexRoutes 		= require("./routes/index")



mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(function(){
	console.log("Connected to DB");
}). catch (err => {
	console.log("ERROR:", err.message)	
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB() // Seed data

// Passport configuration

app.use(session({
    secret: "Once again Rusty is the best and cutest dog in the world", 
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error"); 
	res.locals.success= req.flash("success"); 
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// app.listen(3000, function(){
// 	console.log("The server is running on port 3000")
// });
app.listen(process.env.PORT || 3000 , process.env.IP, function() { 
  console.log('Server listening on port 3000'); 
});
