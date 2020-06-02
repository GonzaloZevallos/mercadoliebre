module.exports = (req, res, next) => {
   // Si no existe session.cart, lo inicializamos vacío
   if (!req.session.cart) {
      req.session.cart = 0;
   }
   // Setear en locals la cantidad de productos
   res.locals.cartQty = req.session.cart;
   next();
}