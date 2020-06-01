// ******** Sequelize ***********

const { User, Token } = require('../database/models');

module.exports = async (req, res, next) => {

   res.locals.user = false;

   if (req.session.user) {
      res.locals.user = req.session.user;
   } else if (req.cookies.userToken){
      const userToken = await Token.findOne({
         where: {
            token: req.cookies.userToken
         }
      });

      const user = await User.findByPK(userToken.userId);
      delete user.password;
      
      req.session.user = user;
      res.locals.user = user;
   }
   
   return next();

}