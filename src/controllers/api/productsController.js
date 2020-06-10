const { Product } = require('../../database/models');

module.exports = {
   index(req, res) {
      Product.findAll({
         include: {
            all: true
         }
      })
         .then(products => {

            if(products.length > 0){
               products.forEach(product => product.setDataValue('endpoint', req.originalUrl + '/' + product.id));
   
               let response = {
                  meta: {
                     status: 200,
                     url: req.originalUrl,
                     length: products.length
                  },
                  data: products
               }
               return res.send(response);
            }

            let response = {
               meta: {
                  status: 204,
                  url: req.originalUrl
               },
               data: null
            }
            return res.send(response);
         })
         .catch(e => console.log(e));
   },
   find(req, res) {
      Product.findByPk(req.params.id,{
         include: {
            all: true
         }
      })
         .then(product => {

            if(product){
               product.setDataValue('endpoint', req.originalUrl + '/' + product.id);
   
               let response = {
                  meta: {
                     status: 200,
                     url: req.originalUrl,
                     length: product ? 1 : 0
                  },
                  data: product
               }
               return res.send(response);
            }

            let response = {
               meta: {
                  status: 200,
                  url: req.originalUrl
               },
               data: null
            }
            return res.send(response);

         })
         .catch(e => console.log(e));
   },
   store (req, res) {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
         const _body = req.body;
         _body.price = parseInt(req.body.price, 10);
         _body.discount = parseInt(req.body.discount, 10);
         _body.image = req.file.filename;
         _body.userId = req.session.user.id;
         _body.categoryId = parseInt(req.body.category, 10);
         _body.brandId = parseInt(req.body.brand, 10);

         Product.create(_body)
            .then(product => {

               if(product){
                  let response = {
                     meta: {
                        status: 201,
                        url: req.originalUrl
                     },
                     data: product
                  }

                  return res.send(response);
               }

               let response = {
                  meta: {
                     status: 204,
                     url: req.originalUrl
                  }
               }

               return res.send(response);
            })
            .catch(e => console.log(e));
      } else {

         let response = {
            meta: {
               status: 204,
               url: req.originalUrl
            },
            errors: errors.mapped()
         }

         return res.send(response);
      }
   },
   update (req, res) {
      const errors = validationResult(req);

      if (errors.isEmpty()) {

         Product.findByPk(req.params.id)
            .then(product => {

               const _body = req.body;

               _body.price = parseInt(req.body.price, 10);
               _body.discount = parseInt(req.body.discount, 10);
               _body.image = req.file != undefined ? req.file.filename : product.image;
               _body.userId = req.session.user.id;
               _body.categoryId = parseInt(req.body.category, 10);
               _body.brandId = parseInt(req.body.brand, 10);
               delete _body.brand;
               delete _body.category;

               return Product.update(_body, {
                  where: {
                     id: req.params.id
                  }
               })
            })
            .then(confirm => {
               if (confirm) {
                  let response = {
                     meta: {
                        status: 201,
                        url: req.originalUrl
                     }
                  }

                  return res.send(response);
               }

               let response = {
                  meta: {
                     status: 204,
                     url: req.originalUrl
                  }
               }

               return res.send(response);
            })
            .catch(e => console.log(e));

      } else {
         let response = {
            meta: {
               status: 204,
               url: req.originalUrl
            },
            errors: errors.mapped()
         }

         return res.send(response);
      }
   },
   destroy (req, res) {
      Product.destroy({
         where: {
            id: req.params.id
         }
      })
         .then(confirm => {
            if(confirm){

               let response = {
                  meta: {
                     status: 201,
                     url: req.originalUrl
                  }
               }

               return res.send(response);
            }

            let response = {
               meta: {
                  status: 204,
                  url: req.originalUrl
               }
            }

            return res.send(response);
         })
         .catch(e => console.log(e));
   }
}