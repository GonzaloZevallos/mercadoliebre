const axios = require('axios');
const defaults = require('./defaults');

const url = 'products';

module.exports = {
   getProducts () {
      return axios({
         ...defaults,
         method: 'get',
         url: url
      })
   },
   getProduct (id) {
      return axios({
         ...defaults,
         method: 'get',
         url: `${url}/${id}`
      })
   }
};