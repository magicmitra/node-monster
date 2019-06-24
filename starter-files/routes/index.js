const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
// NOTE: this passes to middleware first then homepage
router.get('/', storeController.myMiddleware, storeController.homePage);



module.exports = router;
