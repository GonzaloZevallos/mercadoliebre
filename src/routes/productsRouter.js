// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ************ Middlewares ************

const authMiddleware = require('../middlewares/auth');
const sellerMiddleware = require('../middlewares/seller');
const validator = require('../middlewares/validator');

// ************ Controller Require ************

const productsController = require('../controllers/productsController');

// ************  Multer Config  ***************

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/users'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({
   storage: storage,

   // Validate image
   fileFilter: (req, file, cb) => {


      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
      console.log(file);
      const ext = path.extname(file.originalname);
      if (!acceptedExtensions.includes(ext)) {
         req.file = file;
      }
      cb(null, acceptedExtensions.includes(ext));
   }
});


// ************       Routes       ************

router.get('/', productsController.index); /* GET - All products - index */
router.get('/detail/:id', productsController.detail); /* GET - Product detail - show*/

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', authMiddleware, productsController.create); /* GET - Form to create - create */
router.post('/', upload.single('image'), validator.createProduct, productsController.store); /* POST - Store in DB - store*/

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', sellerMiddleware, productsController.edit); /* GET - Form to create - edit */
router.put('/:id', sellerMiddleware, validator.editProduct, productsController.update); /* PUT - Update in DB - update*/

/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', sellerMiddleware, productsController.destroy); /* DELETE - Delete from DB - destroy */

module.exports = router;
