// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/images/products'))
   },
   filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
   }
})

var upload = multer({ storage: storage })

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

router.get('/', productsController.index); /* GET - All products - index */
router.get('/detail/:id', productsController.detail); /* GET - Product detail - show*/

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); /* GET - Form to create - create */
router.post('/', upload.single('image'), productsController.store); /* POST - Store in DB - store*/

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', productsController.edit); /* GET - Form to create - edit */
router.put('/:id', productsController.update); /* PUT - Update in DB - update*/

/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); /* DELETE - Delete from DB - destroy */

module.exports = router;
