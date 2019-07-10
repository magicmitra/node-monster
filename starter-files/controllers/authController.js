// A strategy is an interface with checking user is allowed
// to login or not. Local strategy will be used for this
const passport = require('passport');
const crypto = require('crypto'); // from node. cryptographs text/token
const mongoose = require('mongoose');
const User = mongoose.model('User');

// 'local' puts the user object on each request  
exports.login = passport.authenticate('local', {
    failureRedirect: '/login', // redirect bitches to login
    failureFlash: 'Failed Login!', 
    successRedirect: '/',
    successFlash: `Youre logged in`,
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

exports.forgot= async (req, res) => {
    // 1. see if user exists by email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'A password reset has been mailed to you.');
        return res.redirect('/login');
    }
    // 2. if user -> set/reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hr from now
    await user.save(); // save to DB
    // 3. send an email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`; // the host on url
    req.flash('success', `You have been emailed a password reset link ${resetURL}`); 
    // 4. redirect to login page
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    // check of token is valid and check if it is not expired
    const user = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        // $gt -> 'greater than'
        resetPasswordExpires: { $gt: Date.now() },
    }); 
    if(!user) {
        req.flash('error', 'Password reset token expired or invalid');
        return res.redirect('/login');
    }
    // if there is a user, show the reset password form
    res.render('reset', { title: 'Reset Password' });
};

exports.confirmedPasswords = (req, res, next) => {
    // square brackets to access req.body and shit has a dash
    if(req.body.password === req.body['password-confirm']) {
        next(); // keep going
        return;
    }
    req.flash('error', 'Passwords Do Not Match');
    res.redirect('back');
};

exports.update = async (req, res) => {

};
