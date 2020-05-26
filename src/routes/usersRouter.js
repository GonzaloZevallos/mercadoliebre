// ************  Requires  ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ************ Middlewares ************

const guestMiddleware = require('../middlewares/guest');
const authMiddleware = require('../middlewares/auth');

// ************ Controller Require ************

const usersController = require('../controllers/usersController');

// ************  Multer Config  ***************

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/users'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({ storage: storage })

// ************       Routes       ************

router.get('/', usersController.index); /* GET - All users */
router.get('/profile/', authMiddleware, usersController.profile); /* GET - user detail */

/*** REGISTER user ***/ 
router.get('/register/', guestMiddleware , usersController.create); /* GET - Form to create */
router.post('/', guestMiddleware, upload.single('image'), usersController.store); /* POST - Store in DB */

/*** LOG user ***/
router.get('/login/', guestMiddleware, usersController.showLogin); /* GET - Form to create */
router.post('/login/', guestMiddleware, usersController.processLogin); /* POST - Log user */

/*** LOGOUT user ***/

router.post('/logout/', authMiddleware, usersController.logout); /* POST - Logout user */

/*** EDIT ONE user ***/ 
router.get('/:id/edit/', usersController.edit); /* GET - Form to create */
router.put('/:id', usersController.update); /* PUT - Update in DB */

/*** DELETE ONE user***/ 
router.delete('/:id', usersController.destroy); /* DELETE - Delete from DB */

module.exports = router;
