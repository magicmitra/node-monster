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
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Supply an email address',
    },
    name: {
        type: String,
        required: 'Supply a name',
        trim: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

});

// a virtual field 'gravatar'
userSchema.virtual('gravatar').get(function() {
    /**
     * hash the email
     * use that hash to find gravatar. 
     * default ones will be provided for ones with no image
     */
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
})

// authenticate with passportLocalMongoose
// .register used on userController.register() is possible because
// of passportLocalMongoose
userSchema.plugin(passportLocalMongoose, { usernameField: 'email', });
userSchema.plugin(mongodbErrorHandler); // better fucking error messages

module.exports = mongoose.model('User', userSchema);