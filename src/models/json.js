const fs = require('fs');
const path = require('path');

class JsonModel {
   constructor (name) {
      this.modelName = name;
      this.modelPath = path.join(__dirname, `../data/${this.modelName}.json`);
   }

   getAll () {
      let fileContent = fs.readFileSync(this.modelPath, 'utf-8');
      return fileContent.length > 0 ? JSON.parse(fileContent) : [];
   }

   save (newData) {
      let allData = this.getAll();
      let id = this.generateId();
      newData = { id, ...newData }
      allData = [...allData, newData];
      fs.writeFileSync(this.modelPath, JSON.stringify(allData, null, ' '));
   }

   generateId () {
      let allData = this.getAll();
      if (allData.length === 0) {
         return 1;
      }
      return ++allData.pop().id;
   }

   findByPK (id) {
      let allData = this.getAll();

      return allData.find(product => product.id == id);
   }

   filterBySomething (callback) {
      let allData = this.getAll();

      let results = allData.filter(callback);

      return results;
      // return results.length > 1 ? results : results[0];
   }

   destroy (id) {
      let allData = this.getAll();

      allData = allData.filter(product => product.id != id);

      fs.writeFileSync(this.modelPath, JSON.stringify(allData, null, ' '));
   }

   update (data, id) {
      let allData = this.getAll();
      let newData = allData.map(element => element.id == id ? element = { id, ...data } : element);
      fs.writeFileSync(this.modelPath, JSON.stringify(newData, null, ' '));
   }

   getLast () {
      let allData = this.getAll();

      return allData[allData.length - 1];
   }
}



module.exports = JsonModel;