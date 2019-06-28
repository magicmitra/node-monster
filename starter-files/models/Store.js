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
storeSchema.pre('save', async function(next) {
    // if name isnt modified, theres no need to run slug
    if(!this.isModified('name')) {
        return next(); // skip and exit function
    }
    this.slug = slug(this.name);
    // find other stores of same slug
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
});

module.exports= mongoose.model('Store', storeSchema);