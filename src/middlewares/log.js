const jsonModel = require('../models/json');
const userModel = jsonModel('users');
const userTokenModel = jsonModel('userToken');

module.exports = (req, res, next) => {

   res.locals.user = false;

   if (req.session.user) {
      res.locals.user = req.session.user;
   } else if (req.cookies.userToken){
      const userToken = userTokenModel.findBySomething(e => e.token == req.cookies.userToken);

      const user = userModel.findByPK(userToken.userId);
      delete user.password;
      
      req.session.user = user;
      res.locals.user = user;
   }
   
   return next();

}