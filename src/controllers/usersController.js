const bycrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// ******** Sequelize ***********

const { User, Product, Token, Brand} = require('../database/models');

module.exports = {
   // Index - Show all users
   index (req, res) {
      
      User.findAll()
         .then(users => res.render('users/users', { users }))
         .catch(e => console.log(e));
   },

   // Profile - Profile from one user
   profile (req, res) {

      Product.findAll({
         where: {
            userId: req.session.user.id
         }
      })
         .then(products => res.render('users/profile', { products }))
         .catch(e => console.log(e));
   },

   // Create - Form to create
   create (req, res) {
      
      return res.render('users/user-register-form');
   },

   // Store -  Method to store
   store (req, res) {
      
      const errors = validationResult(req);
      // return res.send(errors)
      
      if(errors.isEmpty()){
         
         const _body = req.body;
         delete _body.retype;
         _body.password = bycrypt.hashSync(_body.password, 10);
         _body.admin = 0;
         _body.image = req.file ? req.file.filename : null

         User.create(_body)
            .then(user => res.redirect('/users/login/'))
            .catch(e => console.log(e));
      } else {
         return res.render('users/user-register-form', { errors: errors.mapped(), old: req.body });
      }

   },

   // Login - Form to login
   showLogin (req, res) {
      return res.render('users/user-login-form');
   },

   processLogin (req, res) {

      const errors = validationResult(req);

      if(errors.isEmpty()){
         
         User.findOne({
            where: {
               email: req.body.email
            }
         })
            .then(user => {
               //Logueo al usuario
               delete user.password;
               req.session.user = user;
      
               //Recuerdo al usuario si puso "Recuérdame"
               if(req.body.remember){
      
                  // https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
                  const token = crypto.randomBytes(64).toString('base64');
                  // Creo la cookie por 3 meses
                  res.cookie('userToken', token, { maxAge: 1000 * 60 * 60 * 24 * 90 });
                  // La guardo en la DB
                  Token.create({
                     token,
                     userId: user.id
                  })
                     .then(response => res.redirect(req.header('Referer') || '/'))
                     .catch(e => console.log(e));
               } else {
                  return res.redirect(req.header('Referer') || '/');
               }

            })
            .catch(e => console.log(e));
            
      } else {
         return res.render('users/user-login-form', { errors: errors.mapped() , old: req.body});
      }

   },

   logout (req, res) {
      
      // Borro la session
      req.session.destroy();

      //Borro la cookie
      if (req.cookies.userToken){
         Token.findOne({
            where: {
               token: req.cookies.userToken
            }
         })
            .then(token => {
               if (token){
                  Token.destroy({
                     where: {
                        id: token.id
                     }
                  })
                     .then(token => {
                        res.clearCookie('userToken')
                        return res.redirect('/');
                     })
                     .catch(e => console.log(e));
               }
            })
            .catch(e => console.log(e));
      } else {
         return res.redirect('/');
      }


   },

   // Update - Form to edit
   edit (req, res) {
      
      const user = User.findByPK(req.params.id);

      return res.render('user-edit-form', { user });
   },
   // Update - Method to update
   update (req, res) {
      
      User.update(req.body, {
         id: req.req.params.id
      })
         .then(user => res.redirect('/user/profile/' + req.params.id))
         .catch(e => console.log(e));
   },

   // Delete - Delete one user from DB
   destroy (req, res) {
      
      User.destroy({
         where: {
            id: req.params.id
         }
      })
         .then(user => res.redirect('/'))
         .catch(e => console.log(e));
   }
}