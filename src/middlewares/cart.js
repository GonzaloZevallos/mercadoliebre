const { Cart } = require('../database/models');

module.exports = async (req, res, next) => {
   if (req.session.user) {
      Cart.findAndCountAll({
         where: {
            userId: req.session.user.id,
            state: 1
         }
      })
         .then(data => {
            res.locals.cartQty = data.count;
            return next();
         })
   }  else {
      return next();
   }
}