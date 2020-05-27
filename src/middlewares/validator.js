const path = require('path');
const { body } = require('express-validator');
const bycrips = require('bcryptjs');

const jsonModel = require('../models/json');
const userModel = jsonModel('users');

module.exports = {

   register: [
      // Email
      body('email')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isEmail().withMessage('Debes ingresar un email válido'),
      // Image
      body('image')
         .custom((value, { req }) => {

            if(req.file != undefined){
               const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
               const ext = path.extname(req.file.originalname)
               return acceptedExtensions.includes(ext);
            }

            return true
         }).withMessage('La imagen debe tener uno de los siguientes formatos: JPG, JPEG, PNG'),
      // Password
      body('password')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 carácteres'),
      // Retype password
      body('retype')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .custom((value, { req }) => req.body.password == req.body.retype).withMessage('Las contraseñas no coinciden')
   ],
   login: [
      // Email
      body('email')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isEmail().withMessage('Debes ingresar un email válido').bail()
         .custom((value, { req }) => {
            const user = userModel.findBySomething(e => e.email == req.body.email);
            if(user){
               return true
            }
            return false
         }).withMessage('Contraseña o email inválidos').bail()
         .custom((value, { req }) => {
            const user = userModel.findBySomething(e => e.email == req.body.email);

            return bycrips.compareSync(req.body.password, user.password);
         }).withMessage('Contraseña o email inválidos')
      
   ],
   createProduct: [

   ],
   editProduct: [

   ]
}