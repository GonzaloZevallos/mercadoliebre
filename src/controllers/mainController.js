const jsonModel = require('../models/json');
const productsModel = jsonModel('products');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
	root: function (req, res){
		let visited = productsModel.filterBySomething(e => e.category == 'visited');
		let inSale = productsModel.filterBySomething(e => e.category == 'in-sale');

		res.render('index', { visited, inSale, toThousand })
	},
	search (req, res) {
		let search = req.query.keywords;
		let products = productsModel.filterBySomething(product => product.name == search);

		res.render('results', { products, toThousand })
	}
};
