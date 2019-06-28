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
    photo: String
});

// pre save hook on 'slug' property
// code executes before saving 
storeSchema.pre('save', function(next) {
    // if name isnt modified, theres no need to run slug
    if(!this.isModified('name')) {
        return next(); // skip and exit function
    }
    this.slug = slug(this.name);
    next();
    // TODO: make more resilient so slugs are unique
})

module.exports= mongoose.model('Store', storeSchema);