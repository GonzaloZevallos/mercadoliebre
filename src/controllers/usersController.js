const jsonModel = require('../models/json');
const usersModel = new jsonModel('users');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
   // Root - Show all users
   root(req, res) {
      // Do the magic
      let users = usersModel.getAll();

      res.render('users', { users });
   },

   // Profile - Profile from one user
   profile(req, res) {
      // Do the magic
      let user = usersModel.findByPK(req.params.userId);

      res.render('detail', { user });
   },

   // Create - Form to create
   create(req, res) {
      // Do the magic
      res.render('user-register-form');
   },

   // Store -  Method to store
   store(req, res) {
      // Do the magic

      let newUser = {
         ...req.body,
         image: req.files ? req.files[0] : 'default-image.png'
      };

      usersModel.save(newUser);

      // Will be change when we use session & cookies
      res.redirect('/user/profile/' + usersModel.getLast().id);
   },

   // Login - Form to login
   showLogin (req, res) {
      res.render('user-login-form');
   },

   processLogin () {

   },

   // Update - Form to edit
   edit(req, res) {
      // Do the magic
      let user = usersModel.findByPK(req.params.userId);

      res.render('user-edit-form', { user });
   },
   // Update - Method to update
   update(req, res) {
      // Do the magic

      usersModel.update(req.body, req.req.params.userId);

      res.redirect('/user/profile/' + req.params.userId);

   },

   // Delete - Delete one user from DB
   destroy(req, res) {
      // Do the magic
      usersModel.destroy(req.params.userId);

      res.redirect('/');
   }
}