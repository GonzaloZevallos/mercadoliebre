// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/users'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({ storage: storage })

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

router.get('/', usersController.index); /* GET - All users */
router.get('/profile/', usersController.profile); /* GET - user detail */

/*** REGISTER user ***/ 
router.get('/register/', usersController.create); /* GET - Form to create */
router.post('/', upload.single('image'), usersController.store); /* POST - Store in DB */

/*** LOG user ***/
router.get('/login/', usersController.showLogin); /* GET - Form to create */
router.post('/login/', usersController.processLogin); /* POST - Log user */

/*** LOGOUT user ***/

router.post('/logout/', usersController.logout); /* POST - Logout user */

/*** EDIT ONE user ***/ 
router.get('/:id/edit/', usersController.edit); /* GET - Form to create */
router.put('/:id', usersController.update); /* PUT - Update in DB */

/*** DELETE ONE user***/ 
router.delete('/:id', usersController.destroy); /* DELETE - Delete from DB */

module.exports = router;
