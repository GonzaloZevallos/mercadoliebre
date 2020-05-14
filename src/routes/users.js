// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

router.get('/', usersController.root); /* GET - All users */
router.get('/profile/:userId/', usersController.profile); /* GET - user detail */

/*** CREATE ONE user ***/ 
router.get('/register/', usersController.create); /* GET - Form to create */
router.post('/create/', usersController.store); /* POST - Store in DB */

/*** LOG user ***/
router.get('/login/', usersController.showLogin); /* GET - Form to create */
router.post('/login/', usersController.processLogin); /* GET - Log user */

/*** EDIT ONE user ***/ 
router.get('/edit/:userId', usersController.edit); /* GET - Form to create */
router.put('/edit/:userId', usersController.update); /* PUT - Update in DB */

/*** DELETE ONE user***/ 
router.delete('/delete/:userId', usersController.destroy); /* DELETE - Delete from DB */

module.exports = router;
