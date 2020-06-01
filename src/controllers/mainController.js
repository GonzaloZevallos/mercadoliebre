// ******** Sequelize ***********

const { Product, Sequelize } = require('../database/models');
const Op = Sequelize.Op;

module.exports = {
	async index (req, res){
		let ultimos = await Product.findAll({
			order: [['createdAt', 'DESC']],
			limit: 6
		});
		let inSale = await Product.findAll({
			where: {
				discount: {
					[Op.gt]: 0
				}
			},
			limit: 6
		});

		res.render('index', { ultimos, inSale: inSale.sort(() => Math.random() - 0.5) })
	},
	async search (req, res) {

		let products = await Product.findAll({
			where: {
				name: {
					[Op.like]: `%${req.query.keywords}%`
				}
			},
			limit: 12
		});

		res.render('results', { products })
	}
};
