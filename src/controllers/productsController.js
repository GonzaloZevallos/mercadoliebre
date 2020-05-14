const jsonModel = require('../models/json');
const productsModel = new jsonModel('products');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
	// Root - Show all products
	root (req, res) {
		// Do the magic
		let products = productsModel.getAll();
		res.render('products', { products, toThousand });
	},

	// Detail - Detail from one product
	detail (req, res) {
		// Do the magic
		let product = productsModel.findByPK(req.params.productId);
		res.render('detail', { product, toThousand });
	},

	// Create - Form to create
	create (req, res) {
		// Do the magic
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store (req, res) {
		// Do the magic

		let newProduct = {
			...req.body,
			image: req.files ? req.files[0] : 'default-image.png'
		};

		productsModel.save(newProduct);

		res.redirect('/products/detail/' + productsModel.getLast().id);
	},

	// Update - Form to edit
	edit (req, res) {
		// Do the magic
		let product = productsModel.findByPK(req.params.productId);

		res.render('product-edit-form', { product, toThousand });
	},
	// Update - Method to update
	update (req, res) {
		// Do the magic

		productsModel.update(req.body, req.req.params.productId);

		res.redirect('/products/detail/' + req.params.productId);

	},

	// Delete - Delete one product from DB
	destroy (req, res) {
		// Do the magic
		productsModel.destroy(req.params.productId);

		res.redirect('/products');
	}
}