const express = require('express');
const router = express.Router();
const apiProductsController = require('../../controllers/api/productsController');

// ************       Routes       ************

router.get('/', apiProductsController.index); /* GET - All products - index */
router.get('/:id', apiProductsController.find); /* GET - Product detail - show*/

/*** CREATE ONE PRODUCT ***/
// router.get('/create', apiProductsController.create); /* GET - Form to create - create */
router.post('/', apiProductsController.store); /* POST - Store in DB - store*/

/*** EDIT ONE PRODUCT ***/
// router.get('/:id/edit', apiProductsController.edit); /* GET - Form to create - edit */
router.patch('/:id', apiProductsController.update); /* PUT - Update in DB - update*/

/*** DELETE ONE PRODUCT***/
router.delete('/:id', apiProductsController.destroy); /* DELETE - Delete from DB - destroy */

module.exports = router;