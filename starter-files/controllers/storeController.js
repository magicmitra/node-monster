const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer'); // handling photo upload
const jimp = require('jimp'); // resizing photos
const uuid = require('uuid'); // make filenames unique

const multerOptions = {
    storage: multer.memoryStorage(), // store in memory
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That file type is not allowed' }, false);
        }
    }
};

// middleware for multer
exports.upload = multer(multerOptions).single('photo');

// middleware, 'next' because the next process will have to be called
exports.resize = async(req, res, next) => {
    // check if no photo to resize
    if(!req.file) {
        next(); // skip to next middleware 
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // photo written into filesystem, move on
    next(); // call createStore() or updateStore() which ever the router specifies
}

exports.homePage = (req, res) => {
    // console.log(req.name);
    res.render('index');
};

// calls the form to render form
exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

// actual adding of store into DB
exports.createStore = async (req, res) => {
    req.body.author = req.user._id; 
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Leave a review, or not.`)
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // Query the DB for a list of all stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

// confirm that an owner owns a store before editting it 
const confirmOwner = (store, user) => {
    if(!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it');
    }
};

// finds a store and calls the form to render
exports.editStore = async (req, res) => {
    // 1. Find store given the ID
    const store = await Store.findOne({ _id: req.params.id });
    // 2. Confirm owner of store
    confirmOwner(store, req.user);
    // 3. Render out the edit form so user can update the store
    res.render('editStore', { title: `Edit ${store.name}`, store })
};

// actual update of a store into DB
exports.updateStore = async (req, res) => {
    // set the location data to be a point
    req.body.location.type = 'Point';
    // find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of old
        runValidators: true, // force validators on model to run again
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>
    <a href="/stores/${store.slug}">View Store</a>`);
    // redirect into store and confirm success
    res.redirect(`/stores/${store._id}/edit`);
};

// getting store by slug
exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }); 
    if(!store) return next();
    res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
    // on intial request, there is no req.params.tag
    const tag = req.params.tag;
    // $exists: true, just pull all documents that have a tag field
    const tagQuery = tag || { $exists: true };
    // create static methods in our Store model and 
    // we can name them whatever the fuck we want 
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
    const stores = await Store.find({
        // now doable because of index definition at store model
        $text: {
            $search: req.query.q,
        }
    }, {
        // creates a score based off the occurences of searched text
        // METADATA calculator
        score: { $meta: 'textScore' }
    })
    .sort({
        // rearranges score in descending order
        // METADATA calculator
        score: { $meta: 'textScore' }
    })
    .limit(5); // limit to only 5 results
    res.json(stores);
};