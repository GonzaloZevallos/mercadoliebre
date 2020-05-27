const jsonModel = require('../models/json');
const productModel = jsonModel('products');

module.exports = (req, res, next) => {
   const product = productModel.findByPK(req.params.id);
   console.log(product);
   if(product){
      if(req.session.user.id != product.userId){
         return res.redirect('/');
      }
   }

   return next();
}