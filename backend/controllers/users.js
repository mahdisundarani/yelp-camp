const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.json({ message: "Ready for registration" });
}

module.exports.register = async(req,res,next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user,password);
        
        req.login(registeredUser,err=>{
            if(err) return next(err);
            res.status(201).json({ user: registeredUser, message: 'Welcome to YelpCamp!' });
        }) 
    }catch(e){
        res.status(400).json({ error: e.message });
    } 
}

module.exports.renderLogin = (req,res)=>{
    res.json({ message: "Ready for login" });
}

module.exports.login = (req,res)=>{ 
    res.json({ user: req.user, message: 'Welcome back!' });
}

// router.post('/login',
//     // use the storeReturnTo middleware to save the returnTo value from session to res.locals
//     storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
//     // Now we can use res.locals.returnTo to redirect the user after login
//     (req, res) => {
//         req.flash('success', 'Welcome back!');
//         const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
//         res.redirect(redirectUrl);
//     });

// in video 
// router.get('/logout',(req,res)=>{
//     req.logOut();
//     req.flash('success','Goodbye!')
//     res.redirect('/campgrounds')
// })
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Goodbye!' });
    });
}