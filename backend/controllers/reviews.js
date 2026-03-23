const Campground = require('../models/campground');
const Review = require('../models/reviews')

module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground) return res.status(404).json({ error: "Campground not found" });

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.status(201).json({ review, message: 'Created new review!' });
}

module.exports.updateReview = async(req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, { ...req.body.review }, { new: true });
    // Keep author intact by populating it if necessary, though the frontend just needs the updated body/rating
    res.json({ review, message: 'Successfully updated review!' });
}

module.exports.deleteReview = async (req,res) =>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Successfully deleted review!' });
} 