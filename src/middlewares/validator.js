const path = require('path');
const { body } = require('express-validator');
const bycrips = require('bcryptjs');

// ******** Sequelize ***********

const { User } = require('../database/models');

module.exports = {

   register: [
      //Username
      body('username')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .custom((value, { req }) => {

            User.findOne({
               where: {
                  username: req.body.username
               }
            })
               .then(user => {
                  console.log(user)
                  return user === null;
               })
               .catch(e => console.log(e))

         }).withMessage('Este usuario ya esta registrado'),
      // Email
      body('email')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isEmail().withMessage('Debes ingresar un email válido').bail()
         .custom(async (value, { req }) => {

            console.log('email')

            const user = await User.findOne({
               where: {
                  email: req.body.email
               }
            })

            return user === null;

         }).withMessage('Este email ya esta registrado'),
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
         .custom(async (value, { req }) => {
            const user = await User.findOne({
               where: {
                  email: req.body.email
               }
            })

            return user;
         }).withMessage('Contraseña o email inválidos').bail()
         .custom(async (value, { req }) => {

            const user = await User.findOne({
               where: {
                  email: req.body.email
               }
            })

            return bycrips.compareSync(req.body.password, user.password);

         }).withMessage('Contraseña o email inválidos')
      
   ],
   createProduct: [
      body('name')
         .notEmpty().withMessage('Campo obligatorio'),
      body('price')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isNumeric().withMessage('Solo se aceptan números').bail()
         .custom((value, { req }) => req.body.price > 0).withMessage('No se aceptan números negativos'),
      body('image')
         .custom((value, { req }) => req.file).withMessage('Debes ingresar una imagen para tu producto').bail()
         .custom((value, { req }) => {

            const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
            const ext = path.extname(req.file.originalname)
            return acceptedExtensions.includes(ext);

         }).withMessage('La imagen debe tener uno de los siguientes formatos: JPG, JPEG, PNG'),
      body('price')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .custom((value, { req }) => parseInt(req.body.price, 10) > 0).withMessage('No se aceptan números negativos'),
      body('discount')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isNumeric().withMessage('Solo se aceptan números').bail()
         .custom((value, { req }) => parseInt(req.body.discount, 10) < 99).withMessage('El descuento no puede ser mayor ni igual al 100%'),
      body('category')
         .notEmpty().withMessage('Campo obligatorio'),
      body('description')
         .notEmpty().withMessage('Campo obligatorio').bail()
         .isLength({ min: 30 }).withMessage('La descripción debe tener al menos 30 carácteres').bail()
         .isLength({ max: 100 }).withMessage('La descripción debe tener menos de 100 carácteres')
   ],
   editProduct: [

   ]
}