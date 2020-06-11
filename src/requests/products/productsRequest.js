const axios = require('axios');
const defaults = require('./defaults');

const url = 'products';

module.exports = {
   getProducts () {
      return axios({
         ...defaults,
         method: 'GET',
         url
      });
   },
   getProduct (id) {
      return axios({
         ...defaults,
         method: 'GET',
         url: `${url}/${id}`
      });
   },
   getProductsByCategory (category) {
      return axios({
         ...defaults,
         method: 'GET',
         url,
         params: {
            category
         }
      });
   },
   createProduct (data) {
      return axios({
         ...defaults,
         method: 'POST',
         url,
         data
      });
   }
};