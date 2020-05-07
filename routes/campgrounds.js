var express		= require("express"),
	router		= express.Router(),
	Campground	= require("../models/campground"),
	middleware	= require("../middleware");
//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
    var newCampground = {name: name, price:price, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
			req.flash("error", "Sorry, that campground does not exist!");
            return res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit 
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Sorry, that campground does not exist!");
            return res.redirect("back");
		} else {
			//render edit template with that campground
			res.render("campgrounds/edit", {campground: foundCampground});
		}
    });
});


// update
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //render edit template with that campground
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById (req.params.id, function(err, campground){
		if (err){
            res.redirect("/campgrounds");
		} else {
			campground.remove();
            res.redirect("/campgrounds");
		}	
	});
});

module.exports = router;
