const { Product, Category } = require('../../database/models');
const { validationResult } = require('express-validator');

const response = (req, res, meta, data) => res.json({ meta: { ...meta, url: req.originalUrl}, data: data ? data : undefined });;

module.exports = {
   async index(req, res) {

      try {
         const products = await Product.findAll({
            include: ['brand', 'user']
         });

         if (!req.query.category) {
            if (products.length > 0) {
               products.forEach(product => product.setDataValue('endpoint', req.originalUrl + product.id));

               return response(req, res, {
                  status: 200,
                  length: products.length
               }, products)

            }

            return response(req, res, {
               status: 204
            });

         } else {

            try {
               let category = await Category.findByPk(req.query.category, {
                  include: ['products']
               });

               if (category.products.length > 0) {
                  let products = category.products;

                  return response(req, res, {
                     status: 200
                  }, products)

               }

               return response(req, res, {
                  status: 204
               });
               
            } catch (error) {

               console.log(error)
               
               return response(req, res, {
                  status: 204
               });

            }
            

         }
      } catch (error) {
         console.log(error)

         return response(req, res, {
            status: 204
         });
      }
 
   },
   async find(req, res) {

      try {
         const product = await Product.findByPk(req.params.id,{
            include: {
               all: true
            }
         });
   
         if(product){
   
            product.setDataValue('endpoint', req.originalUrl + product.id);
   
            return response(req, res, {
               status: 200
            }, product)
   
         }
   
         return response(req, res, {
            status: 204
         });;
      } catch (error) {
         return response(req, res, {
            status: 204
         });;
      }


   },
   async store (req, res) {

      const errors = validationResult(req);

      if (errors.isEmpty()) {

         const _body = req.body;
         _body.price = Number(req.body.price);
         _body.discount = Number(req.body.discount);
         _body.image = req.file.filename;
         _body.userId = req.session.user.id;
         _body.categoryId = Number(req.body.category);
         _body.brandId = Number(req.body.brand);

         const product = await Product.create(_body);

         if(product){

            return response(req, res, {
               status: 200
            }, product);

         }

         return response(req, res, {
            status: 204
         });;

      } else {
         return response(req, res, {
            status: 204
         }, req.body);
      }
   },
   async update (req, res) {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
         
         try {
            const product = await Product.findByPk(req.params.id)
                  
            const _body = req.body;
   
            _body.price = Number(req.body.price);
            _body.discount = Number(req.body.discount);
            _body.image = req.file != undefined ? req.file.filename : product.image;
            _body.userId = req.session.user.id;
            _body.categoryId = Number(req.body.category);
            _body.brandId = Number(req.body.brand);
            delete _body.brand;
            delete _body.category;
            
            try {
               let confirm = await Product.update(_body, {
                  where: {
                     id: req.params.id
                  }
               });
      
               if (confirm) {
                  return response(req, res, {
                     status: 201
                  });
               }
      
               return response(req, res, {
                  status: 204
               });
            } catch (error) {
               console.log(error)
               return response(req, res, {
                  status: 204
               });
            }
         } catch (error) {
            console.log(error)
            return response(req, res, {
               status: 204
            });
         }

         
      } else {

         return response(req, res, {
            status: 201
         }, errors.mapped());

      }
   },
   async destroy (req, res) {
      try {
         let confirm = await Product.destroy({
            where: {
               id: req.params.id
            }
         })
   
         if(confirm){
            return response(req, res, {
               status: 201
            });
         }
   
         console.log(error)
         return response(req, res, {
            status: 204
         });
      } catch (error) {
         console.log(error)
         return response(req, res, {
            status: 204
         });
      }
   }
}