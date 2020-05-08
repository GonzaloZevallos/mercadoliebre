const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	root: (req, res) => {
		let visited = products.filter(e => e.category == 'visited');
		let inSale = products.filter(e => e.category == 'in-sale');

		res.render('index', {visited, inSale, toThousand})
	},
	search: (req, res) => {
		let search = req.query.keywords;

		let productosEncontrados = products.filter(product => product.name == search);

		res.render('results', { products: productosEncontrados, toThousand })
	},
};

module.exports = controller;
