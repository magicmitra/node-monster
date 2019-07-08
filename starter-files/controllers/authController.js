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
