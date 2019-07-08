const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowecase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Supply an email address',
    },
    name: {
        type: String,
        required: 'Supply a name',
        trim: true,
    },

});

// authenticate with passportLocalMongoose
// .register used on userController.register() is possible because
// of passportLocalMongoose
userSchema.plugin(passportLocalMongoose, { usernameField: 'email', });
userSchema.plugin(mongodbErrorHandler); // better fucking error messages

module.exports = mongoose.model('User', userSchema);