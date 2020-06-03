const { validationResult } = require('express-validator');

// ******** Sequelize ***********

const { Product, Brand, Category } = require('../database/models');

module.exports = {
	// Root - Show all products
	index (req, res) {
		Product.findAll()
			.then(products => res.render('products/products', { products: products.sort(() => Math.random() - 0.5) }))
			.catch(e => console.log(e));
	},

	// Detail - Detail from one product
	detail (req, res) {
		Product.findByPk(req.params.id)
			.then(product => res.render('products/detail', { product }))
			.catch(e => console.log(e));
	},

	// Create - Form to create
	create (req, res) {
		const categories = Category.findAll();
		const brands = Brand.findAll();

		Promise.all([categories, brands])
			.then(([categories, brands]) => res.render('products/product-create-form', { categories, brands }))
			.catch(e => console.log(e));
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
			_body.categoryId = parseInt(req.body.category, 10);
			_body.brandId = parseInt(req.body.brand, 10);

			Product.create(_body)
				.then(product => res.redirect(`/products/detail/${product.id}`))
				.catch(e => console.log(e));
		} else {
			const categories = Category.findAll();
			const brands = Brand.findAll();

			Promise.all([categories, brands])
				.then(([categories, brands]) => res.render('products/product-create-form', { categories, brands, errors: errors.mapped(), old: req.body }))
				.catch(e => console.log(e));
		}

	},

	// Update - Form to edit
	edit (req, res) {
		const product = Product.findByPk(req.params.id);
		const categories = Category.findAll();
		const brands = Brand.findAll();

		Promise.all([product, categories, brands])
			.then(([product, categories, brands]) => res.render('products/product-edit-form', { product, categories, brands }))
			.catch(e => console.log(e));
	},
	// Update - Method to update
	update (req, res) {

		const errors = validationResult(req);

		if (errors.isEmpty()) {

			const product = Product.findByPk(req.params.id)
				.then(product => {

					const _body = req.body;

					_body.price = parseInt(req.body.price, 10);
					_body.discount = parseInt(req.body.discount, 10);
					_body.image = req.file != undefined ? req.file.filename : product.image;
					_body.userId = req.session.user.id;
					_body.categoryId = parseInt(req.body.category, 10);
					_body.brandId = parseInt(req.body.brand, 10);
					delete _body.brand;
					delete _body.category;

					Product.update(_body, {
						where: {
							id: req.params.id
						}
					})
						.then(product => res.redirect(`/products/detail/${req.params.id}`))
						.catch(e => console.log(e));
				})
				.catch(e => console.log(e));

		} else {
			const categories = Category.findAll();
			const brands = Brand.findAll();
	
			Promise.all([categories, brands])
				.then(([categories, brands]) => {
					
					return res.render(
						'products/product-edit-form',
						{ 
							product: req.body,
							categories,
							brands,
							errors: errors.mapped()
					})
				})
				.catch(e => console.log(e));
		}
	},

	// Delete - Delete one product from DB
	destroy (req, res) {
		Product.destroy({
			where: {
				id: req.params.id
			}
		})
			.then(product => res.redirect('/products'))
			.catch(e => console.log(e));
	}
}