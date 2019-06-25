const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
// dont be a fool, wrap your tool. For async functions.
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id', catchErrors(storeController.updateStore));

// NOTE: req.params can be accessed anytime a URL contains a 'wildcard'
// ':value'. Colon, then actual value. Now you fucking know.
// Dynamic URLS buhzitches

module.exports = router;
