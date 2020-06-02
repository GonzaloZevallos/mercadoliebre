const bycrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// ******** Sequelize ***********

const Op = require('../database/models').Op;
const { User, Product, Token, Cart } = require('../database/models');

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
      
      const user = User.findByPk(req.params.id);

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
   },

   cart (req, res) {

      Cart.findAll({
         where: {
            userId: req.session.user.id,
            state: 1
         }
      })
         .then(carts => res.render('users/cart', { carts }))
   },

   addToCart (req, res) {

      req.session.cart++;

      Product.findByPk(req.body.productId)
         .then(product => {

            Cart.findAll({
               limit: 1,
               order: [
                  ['createdAt', 'DESC']
               ]
            })
               .then(arrayCartSearched => {

                  const cartSearched = arrayCartSearched[0];

                  let price = Number(product.discount) ? product.price - (product.price * product.discount / 100) : product.price;
      
                  const cart = {
                     productName: product.name,
                     price: price,
                     quantity: req.body.quantity,
                     image: product.image,
                     subTotal: price * req.body.quantity,
                     state: 1,
                     userId: req.session.user.id,
                     order: cartSearched ? cartSearched.order++ : 1000
                  }
      
                  Cart.create(cart)
                     .then(cart => res.redirect('/users/cart'))
                     .catch(e => console.log(e));
               })
               .catch(e => console.log(e));

         })

   },

   deleteFromCart (req, res) {

      req.session.cart--

      Cart.destroy({
         where: {
            id: req.body.cartId
         }
      })
         .then(response => res.redirect('/users/cart'))
         .catch(e => console.log(e));
      
   },

   shop (req, res) {
      Cart.findAll({
         where: {
            userId: req.body.userId,
            state: 1
         }
      })
         .then(carts => {

            let cartPromises = [];

            carts.forEach(cart => {
               cart.state = 0;
               // No me updatea los carritos
               let promise = Cart.update(cart, {
                  where: {
                     id: cart.id
                  }
               })

               cartPromises = [...cartPromises, promise]
            })

            Promise.all(cartPromises)
               .then(cartPromises => console.log(cartPromises))
               .catch(e => console.log(e));

         })
         .catch(e => console.log(e));
   },

   history (req, res) {
      Cart.findAll()
         .then(carts => {
            return res.send(carts);
            res.render('users/history', { carts })
         })
         .catch(e => console.log(e));
   }
}