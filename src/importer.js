import {Product} from './exports';
import * as util from 'util';
import * as fs from 'fs';
//import * as csv from 'csv-parser';
const csv = require('csv-parser');

class Importer {
  constructor(eventEmitter) {
    eventEmitter.on('dirwatcher:changed', filePath => this.onEvent(filePath));
    this.importAsync = util.promisify(this.import);
  }

  onEvent(filePath) {
    this.importAsync(filePath)
      .then(data => console.log(`${filePath} has been successfuly imported:`
        + JSON.stringify(data)))
      .catch(err => console.error(`An error happened while import ${filePath}.
        ${err}`));
  }

  import(filePath, callback) {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => results.push(new Product(data.id, data.name)))
      .on('end', () => callback(undefined, results))
      .on('error', err => callback(err, undefined));
  }
}

export default Importer;
