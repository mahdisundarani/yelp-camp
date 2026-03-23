const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');


module.exports.index = async(req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.json({ campgrounds });
}

module.exports.renderNewForm = ((req,res)=>{
    // Not used in SPA, but keeping for route compatibility
    return res.json({ message: "Ready to accept new campground" });
})

module.exports.createCampground = async(req,res,next)=>{
        const campground = new Campground(req.body.campground); 
        campground.images =  req.files.map(f => ({url: f.path,filename: f.filename}))
        campground.author = req.user._id;
        await campground.save()
        res.status(201).json({ campground, message: 'Successfully made a new campground!' });
}

module.exports.showCampground = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        return res.status(404).json({ error: 'Cannot find that campground!' });
    }
    res.json({ campground });
}

module.exports.renderEditForm = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)      
    if(!campground){
        return res.status(404).json({ error: 'Cannot find that campground!' });
    } 

    res.json({ campground });
}

module.exports.updateCampground = async(req,res,next)=>{
    const {id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f => ({url: f.path,filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    res.json({ campground, message: 'Successfully updated campground!' });
}

module.exports.deleteCampground = async(req,res,next)=>{
    const {id}= req.params;
    await Campground.findByIdAndDelete(id);
    res.json({ message: 'Successfully deleted campground!' });
}