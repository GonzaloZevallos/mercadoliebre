const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const generateId = () => {
	if(products.length == 0){
		return 1;
	}

	return ++products.pop().id
}

const controller = {
	// Root - Show all products
	root: (req, res) => {
		// Do the magic
		res.render('products', {products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		let product = products.find(product => product.id == req.params.productId);

		res.render('detail', {product, toThousand});
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic

		let product = {
			id: generateId(),
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: 'default-image.png'
		}

		let newProducts = [...products, product];

		jsonNuevo = JSON.stringify(newProducts, null, ' ')

		fs.writeFileSync(productsFilePath, jsonNuevo);

		res.redirect('/products/detail/' + product.id);
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		let product = products.find(product => product.id == req.params.productId);

		res.render('product-edit-form', { product, toThousand });
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		
		let newProducts = products.map(product => {
			if(product.id == req.params.productId){
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
			}

			return product;
		})

		jsonNuevo = JSON.stringify(newProducts, null, ' ')

		fs.writeFileSync(productsFilePath, jsonNuevo);

		res.redirect('/products/detail/' + req.params.productId);

	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let newProducts = products.filter(product => product.id != req.params.productId);

		jsonNuevo = JSON.stringify(newProducts, null, ' ')

		fs.writeFileSync(productsFilePath, jsonNuevo);

		res.redirect('/products');
	}
};

module.exports = controller;