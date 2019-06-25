const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
// dont be a fool, wrap your tool.
router.post('/add', catchErrors(storeController.createStore));



module.exports = router;
