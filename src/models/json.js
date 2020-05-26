const fs = require('fs');
const path = require('path');

module.exports = (name) => {

   return {

      modelPath: path.resolve(__dirname, `../data/${name}.json`),

      getAll () {
         let fileContent = fs.readFileSync(this.modelPath, 'utf-8');
         return fileContent.length > 0 ? JSON.parse(fileContent) : [];
      },

      save (newData) {
         let allData = this.getAll();
         let id = this.generateId();
         newData = { id, ...newData }
         allData = [...allData, newData];
         fs.writeFileSync(this.modelPath, JSON.stringify(allData, null, ' '));
      },

      generateId () {
         let allData = this.getAll();
         if (allData.length == 0) {
            return 1;
         }
         return ++allData.pop().id;
      },

      findByPK (id) {
         let allData = this.getAll();

         return allData.find(product => product.id == id);
      },

      findBySomething (callback) {
         return this.getAll().find(callback);
      },

      filterBySomething (callback) {
         return this.getAll().filter(callback);
      },

      destroy (id) {
         let allData = this.getAll();

         allData = allData.filter(product => product.id != id);

         fs.writeFileSync(this.modelPath, JSON.stringify(allData, null, ' '));
      },

      update (data, id) {
         let allData = this.getAll();
         let newData = allData.map(element => element.id == id ? element = { id, ...data } : element);
         fs.writeFileSync(this.modelPath, JSON.stringify(newData, null, ' '));
      },

      getLast () {
         let allData = this.getAll();

         return allData[allData.length - 1];
      }
   }

}