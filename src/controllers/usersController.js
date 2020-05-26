const jsonModel = require('../models/json');
const usersModel = jsonModel('users');
const userTokenModel = jsonModel('userToken');
const bycrypt = require('bcryptjs');
const crypto = require('crypto');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
   // Root - Show all users
   index (req, res) {
      
      const users = usersModel.getAll();

      return res.render('users/users', { users });
   },

   // Profile - Profile from one user
   profile (req, res) {
      
      const user = usersModel.findByPK(req.params.id);

      return res.render('users/detail', { user });
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

      usersModel.save(newUser);

      return res.redirect('/users/login/');
   },

   // Login - Form to login
   showLogin (req, res) {
      return res.render('users/user-login-form');
   },

   processLogin (req, res) {

      const user = usersModel.findBySomething(e => e.email == req.body.email);

      if(user){

         if(bycrypt.compareSync(req.body.password, user.password)){

            //Logueo al usuario
            delete user.password;
            req.session.user = user;

            //Recuerdo al usuario si puso "Recuérdame"
            if(req.body.remember){

               // https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
               const token = crypto.randomBytes(64).toString('base64');
               // Creo la cookie por 3 meses
               res.cookie('rememberToken', token, { maxAge: 1000 * 60 * 60 * 24 * 90 });
               userTokenModel.save({userId: user.id, token});
            }

            return res.redirect('/');        
         }

         return res.send('Credenciales inválidas.');
      } else {
         return res.send('Credenciales inválidas (email).');
      }

   },

   logout (req, res) {
      
      // Borro la session
      req.session.destroy();

      //Borro la cookie
      req.clearCookie('userToken');

      return res.redirect('/');
   },

   // Update - Form to edit
   edit (req, res) {
      
      const user = usersModel.findByPK(req.params.id);

      return res.render('user-edit-form', { user });
   },
   // Update - Method to update
   update (req, res) {
      

      usersModel.update(req.body, req.req.params.id);

      return res.redirect('/user/profile/' + req.params.id);

   },

   // Delete - Delete one user from DB
   destroy (req, res) {
      
      usersModel.destroy(req.params.id);

      return res.redirect('/');
   }
}