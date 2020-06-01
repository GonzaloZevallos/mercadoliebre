const bycrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// ******** Sequelize ***********

const { User, Product, Token, Brand} = require('../database/models');

module.exports = {
   // Index - Show all users
   async index (req, res) {
      
      const users = await User.findAll();

      return res.render('users/users', { users });
   },

   // Profile - Profile from one user
   async profile (req, res) {

      const products = await Product.findAll({
         where: {
            userId: req.session.user.id
         }
      });

      return res.render('users/profile', { products });
   },

   // Create - Form to create
   create (req, res) {
      
      return res.render('users/user-register-form');
   },

   // Store -  Method to store
   async store (req, res) {
      
      const errors = validationResult(req);

      return res.send(errors)
      
      if(errors.isEmpty()){
         
         const _body = req.body;
         delete _body.retype;
         _body.password = bycrypt.hashSync(_body.password, 10);
         _body.admin = 0;
         _body.image = req.file ? req.file.filename : NULL
         
         // return res.send(_body)
         User.create(_body)
            .then(data => {
               return res.redirect('/users/login/');
            })
            .catch(e => console.log(e))
   
      }

      return res.render('users/user-register-form', { errors: errors.mapped(), old: req.body });
   },

   // Login - Form to login
   showLogin (req, res) {
      return res.render('users/user-login-form');
   },

   async processLogin (req, res) {

      const errors = validationResult(req);

      if(errors.isEmpty()){
         
         const user = await User.findOne({
            where: {
               email: req.body.email
            }
         });

         //Logueo al usuario
         delete user.password;
         req.session.user = user;

         //Recuerdo al usuario si puso "Recuérdame"
         if(req.body.remember){

            // https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
            const token = crypto.randomBytes(64).toString('base64');
            // Creo la cookie por 3 meses
            res.cookie('userToken', token, { maxAge: 1000 * 60 * 60 * 24 * 90 });
            Token.create({
               token,
               userId: user.id
            });
         }

         return res.redirect('/');

      }

      return res.render('users/user-login-form', { errors: errors.mapped() , old: req.body});
   },

   async logout (req, res) {
      
      // Borro la session
      req.session.destroy();

      //Borro la cookie
      const tokenSearched = await Token.findeOne({
         where: {
            token: req.cookies.userToken
         }
      });

      if (tokenSearched){
         await Token.destroy({
            where: {
               id: tokenSearched.id
            }
         });
         res.clearCookie('userToken');
      }

      return res.redirect('/');
   },

   // Update - Form to edit
   edit (req, res) {
      
      const user = User.findByPK(req.params.id);

      return res.render('user-edit-form', { user });
   },
   // Update - Method to update
   // async update (req, res) {
      
   //    await User.update(req.body, req.req.params.id);

   //    return res.redirect('/user/profile/' + req.params.id);
   // },

   // Delete - Delete one user from DB
   async destroy (req, res) {
      
      await User.destroy({
         where: {
            id: req.params.id
         }
      });

      return res.redirect('/');
   }
}