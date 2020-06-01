const { validationResult } = require('express-validator');

// ******** Sequelize ***********

const { User, Product, Token, Brand } = require('../database/models');

module.exports = {
	// Root - Show all products
	index (req, res) {
		const products = productsModel.getAll();
		return res.render('products/products', { products });
	},

	// Detail - Detail from one product
	detail (req, res) {
		const product = productsModel.findByPK(req.params.id);
		return res.render('products/detail', { product });
	},

	// Create - Form to create
	create (req, res) {
		return res.render('products/product-create-form');
	},
	
	// Create -  Method to store
	store (req, res) {

		const errors = validationResult(req);

		if(errors.isEmpty()){
			const _body = req.body;
			_body.price = parseInt(req.body.price, 10);
			_body.discount = parseInt(req.body.discount, 10);
			_body.image = req.file.filename;
			_body.userId = req.session.user.id;

			productsModel.save(_body);

			return res.redirect('/products/detail/' + productsModel.getLast().id);
		}

		return res.render('products/product-create-form', { errors: errors.mapped(), old: req.body })
	},

	// Update - Form to edit
	edit (req, res) {
		const product = productsModel.findByPK(req.params.id);

		return res.render('products/product-edit-form', { product });
	},
	// Update - Method to update
	update (req, res) {

		const _body = req.body;
		_body.userId = req.session.user.id;

		productsModel.update(_body, req.params.id);

		return res.redirect('/products/detail/' + req.params.id);
	},

	// Delete - Delete one product from DB
	destroy (req, res) {
		productsModel.destroy(req.params.id);
		return res.redirect('/products');
	}
}