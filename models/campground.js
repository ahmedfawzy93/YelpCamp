var mongoose = require("mongoose");

const Comment = require('./comment');

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
   	comments: [
    	{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
      	}
   	],
	author: {
    id: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    username: String
    }
});

// Hooking the commonts with the campground so we when we delete the campground, we delete the commonts but we can not use findByIdAndRemove
// instead we have to do findById the pass campground in the function the remove the campground by campground.remove()

campgroundSchema.pre('remove', async function(next) {
	try {
		await Comment.remove({
			_id: {
			$in: this.comments
			}
		});
		next();
	} catch (err){
		next(err);
	}
});


 
module.exports = mongoose.model("Campground", campgroundSchema);