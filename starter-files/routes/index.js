const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
// dont be a fool, wrap your tool. For async functions.
//=================store controllers=======================================
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', 
    storeController.upload,
    catchErrors(storeController.resize), 
    catchErrors(storeController.createStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags', catchErrors(storeController.getStoresByTag));  
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

//========================user controllers================================
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. validate registration data
// 2. register user
// 3. login after registering
router.post('/register', userController.validateRegister);

// NOTE: req.params can be accessed anytime a URL contains a 'wildcard'
// ':value'. Colon, then actual value. Now you fucking know.
// Dynamic URLS buhzitches

module.exports = router;
