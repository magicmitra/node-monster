const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
router.get('/', storeController.homePage);



module.exports = router;
