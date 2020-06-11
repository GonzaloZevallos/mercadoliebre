const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const apiProductsController = require('../../controllers/api/productsController');

// Middlewares

const validator = require('../../middlewares/validator');

// Multer

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../../public/images/products'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({
   storage: storage,

   // Validate image
   fileFilter: (req, file, cb) => {

      console.log(file)

      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];

      const ext = path.extname(file.originalname);

      if (!acceptedExtensions.includes(ext)) {
         req.file = file;
      }

      cb(null, acceptedExtensions.includes(ext));
   }
});

// ************       Routes       ************

router.get('/', apiProductsController.index); /* GET - All products - index */
router.get('/:id', apiProductsController.find); /* GET - Product detail - show*/

/*** CREATE ONE PRODUCT ***/
// router.get('/create', apiProductsController.create); /* GET - Form to create - create */
router.post('/', upload.single('image'), validator.createProduct, apiProductsController.store); /* POST - Store in DB - store*/

/*** EDIT ONE PRODUCT ***/
// router.get('/:id/edit', apiProductsController.edit); /* GET - Form to create - edit */
router.patch('/:id', apiProductsController.update); /* PUT - Update in DB - update*/

/*** DELETE ONE PRODUCT***/
router.delete('/:id', apiProductsController.destroy); /* DELETE - Delete from DB - destroy */

module.exports = router;