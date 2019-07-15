const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here. req has all the info, res has all the methods
// for sending the data back.
// dont be a fool, wrap your tool. For async functions.
//=================store controllers=======================================
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', 
    authController.isLoggedIn, // require authentication to perform this route
    storeController.addStore);

router.post('/add', 
    storeController.upload,
    catchErrors(storeController.resize), 
    catchErrors(storeController.createStore)
);
router.get('/stores/:id/edit', 
    authController.isLoggedIn, // require authentication to perform this route
    catchErrors(storeController.editStore));
router.post('/add/:id', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags', catchErrors(storeController.getStoresByTag));  
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

//========================user and auth controllers================================
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. validate registration data
// 2. register user
// 3. login after registering
router.post('/register', 
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);
router.get('/account', 
    authController.isLoggedIn,
    userController.account
);

router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

// NOTE: req.params can be accessed anytime a URL contains a 'wildcard'
// ':value'. Colon, then actual value. Now you fucking know.
// Dynamic URLS buhzitches

module.exports = router;
