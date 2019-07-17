const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Enter a store name damn it',
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String], 
    created: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [{
            type: Number,
            required: 'Must supply coordinates',
        }],
        address: {
            type: String,
            required: 'Must supply address',
        },
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: 'You must supply an author',
    },
});

// pre save hook on 'slug' property
// code executes before saving 
storeSchema.pre('save', async function(next) {
    // if name isnt modified, theres no need to run slug
    if(!this.isModified('name')) {
        return next(); // skip and exit function
    }
    this.slug = slug(this.name);
    // find other stores of same slug
    // 2nd RegExp() param 'i' means case insensitive
    // 1st RegExp() param -> {this.slug} means it starts with that
    // the second part means that it could end with any of those
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    // this.constructor is bound to the model, the implicit 'Store'
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

// put this on statics,  
storeSchema.statics.getTagsList = function() {
    // google 'mongoDB aggregate operators'
    // 'this' will be bound to the model, its why an arrow function isnt used
    return this.aggregate([
        // pass an object for each pipeline operator
        // operators start with'$'
        // $unwind by tags. creates an instance of each document
        // based off the number of tags with the tag being a single unique entry
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]); 
}

module.exports= mongoose.model('Store', storeSchema);