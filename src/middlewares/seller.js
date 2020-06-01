// ******** Sequelize ***********

const { Product } = require('../database/models');

module.exports = async (req, res, next) => {
   const product = await Product.findByPK(req.params.id);

   if(product){
      if(req.session.user.id != product.userId){
         return res.redirect('/');
      }
   }

   return next();
}