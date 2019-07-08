// A strategy is an interface with checking user is allowed
// to login or not. Local strategy will be used for this
const passport = require('passport');

// 'local' puts the user object on each request  
exports.login = passport.authenticate('local', {
    failureRedirect: '/login', // redirect bitches to login
    failureFlash: 'Failed Login!', 
    successRedirect: '/',
    successFlash: 'You are logged in',
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
};

// Use this middleware to protect pages from being used by
// unauthenticated sessions.
exports.isLoggedIn = (req, res, next) => {
    // 1st check if user is authenticated
    // check with pasport
    if(req.isAuthenticated()) {
        next(); // move on , logged in
        return;
    }
    req.flash('error', 'Must be logged in to perform these');
    res.redirect('/login');
};
