module.exports = (req, res, next) => {
   res.locals.helpers = {
      toThousand(n) { 
         return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
   }
   return next();
}