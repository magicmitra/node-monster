const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register'});
};

// expressValidator() on app.js made this possible
exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Must supply name!').notEmpty();
    req.checkBody('email', 'Email not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
    });
    req.checkBody('password', 'Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Passwords do not match!').equals(req.body.password); 

    // check all validation code 
    const errors = req.validationErrors();
    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, 
            flashes: req.flash() });
        return; // stop the fn from running
    }
    next(); // there were no errors
};