const jsonModel = require('../models/json');
const productsModel = jsonModel('products');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
	// Root - Show all products
	index (req, res) {
		const products = productsModel.getAll();
		return res.render('products/products', { products, toThousand });
	},

	// Detail - Detail from one product
	detail (req, res) {
		const product = productsModel.findByPK(req.params.id);
		return res.render('products/detail', { product, toThousand });
	},

	// Create - Form to create
	create (req, res) {
		return res.render('products/product-create-form');
	},
	
	// Create -  Method to store
	store (req, res) {

		const newProduct = {
			...req.body,
			image: req.files ? req.files[0] : 'default-image.png',
			userId: req.session.user.id
		};

		productsModel.save(newProduct);

		return res.redirect('/products/detail/' + productsModel.getLast().id);
	},

	// Update - Form to edit
	edit (req, res) {
		const product = productsModel.findByPK(req.params.id);

		return res.render('products/product-edit-form', { product, toThousand });
	},
	// Update - Method to update
	update (req, res) {

		productsModel.update({ ...req.body, userId: req.session.user.id }, req.params.id);

		return res.redirect('/products/detail/' + req.params.id);

	},

	// Delete - Delete one product from DB
	destroy (req, res) {
		productsModel.destroy(req.params.id);

		return res.redirect('/products');
	}
}