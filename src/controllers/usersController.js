const jsonModel = require('../models/json');
const userModel = jsonModel('users');
const userTokenModel = jsonModel('userToken');
const productModel = jsonModel('products');
const bycrypt = require('bcryptjs');
const crypto = require('crypto');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
   // Root - Show all users
   index (req, res) {
      
      const users = userModel.getAll();

      return res.render('users/users', { users });
   },

   // Profile - Profile from one user
   profile (req, res) {

      const products = productModel.filterBySomething(e => e.userId == req.session.user.id);

      return res.render('users/profile', { products, toThousand });
   },

   // Create - Form to create
   create (req, res) {
      
      return res.render('users/user-register-form');
   },

   // Store -  Method to store
   store (req, res) {

      const user = req.body;
      delete user.retype;
      user.password = bycrypt.hashSync(user.password, 10);

      const newUser = {
         ...user,
         image: req.file ? req.file.filename : 'default-image.png'
      };

      userModel.save(newUser);

      return res.redirect('/users/login/');
   },

   // Login - Form to login
   showLogin (req, res) {
      return res.render('users/user-login-form');
   },

   processLogin (req, res) {

      const user = userModel.findBySomething(e => e.email == req.body.email);

      if(user){

         if(bycrypt.compareSync(req.body.password, user.password)){

            //Logueo al usuario
            delete user.password;
            req.session.user = user;
            res.locals.user = req.session.user;

            //Recuerdo al usuario si puso "Recuérdame"
            if(req.body.remember){

               // https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
               const token = crypto.randomBytes(64).toString('base64');
               // Creo la cookie por 3 meses
               res.cookie('userToken', token, { maxAge: 1000 * 60 * 60 * 24 * 90 });
               userTokenModel.save({userId: user.id, token});
            }
            return res.redirect('/');        
         }

         return res.send('Credenciales inválidas.');
      }

      return res.send('Credenciales inválidas (email).');

   },

   logout (req, res) {
      
      // Borro la session
      req.session.destroy();

      //Borro la cookie
      console.log(req.cookies.userToken)
      const userToken = userTokenModel.findBySomething(e => e.token == req.cookies.userToken);
      if(userToken){
         userTokenModel.destroy(userToken.id);
         res.clearCookie('userToken');
      }

      return res.redirect('/');
   },

   // Update - Form to edit
   edit (req, res) {
      
      const user = userModel.findByPK(req.params.id);

      return res.render('user-edit-form', { user });
   },
   // Update - Method to update
   update (req, res) {
      

      userModel.update(req.body, req.req.params.id);

      return res.redirect('/user/profile/' + req.params.id);

   },

   // Delete - Delete one user from DB
   destroy (req, res) {
      
      userModel.destroy(req.params.id);

      return res.redirect('/');
   }
}