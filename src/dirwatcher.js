import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

class DirWatcher {
  constructor(eventEmitter) {
    this.watchedFiles = [];
    this.eventEmitter = eventEmitter;
  }

  watch(dirPath, delay) {
    setInterval(() => {
      readDirAsync(dirPath)
        .then(fileNames => watchNewFiles.call(this, dirPath, fileNames))
        .catch(err => console.error(`An error happened while trying to read
           ${dirPath}. ${err}`))
    }, delay)
  }
}

const readDirAsync = util.promisify(fs.readdir);

const watchNewFiles = function watchNewFiles(dirPath, fileNames) {
  fileNames
  .filter(fileName => isNewFile.call(this, fileName))
  .forEach(fileName => {
    this.eventEmitter.emit('dirwatcher:changed', path.join(dirPath, fileName));
    this.watchedFiles.push(fileName);
  });
}

const isNewFile = function isNewFile(file) {
  return !this.watchedFiles.includes(file);
}

export default DirWatcher;
