const { campgroundSchema,reviewSchema } = require('./schemas')
const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground');
const Review = require('./models/reviews')

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        return res.status(401).json({ error: 'You must be signed in first!' });
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    // Reconstruct req.body.campground if it comes from multer's flat FormData
    if (req.body['campground[title]'] || req.body['campground[location]']) {
        req.body.campground = {
            title: req.body['campground[title]'],
            location: req.body['campground[location]'],
            price: req.body['campground[price]'],
            description: req.body['campground[description]']
        };
    }
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
    
}

module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        return res.status(403).json({ error: 'You do not have permission to do that' });
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    const { id ,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        return res.status(403).json({ error: 'You do not have permission to do that' });
    }
    next();
}



module.exports.validateReview =  (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next();
    }
}

module.exports