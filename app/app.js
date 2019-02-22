import {DirWatcher, Importer} from './exports';
import * as path from 'path';
import * as events from 'events';

const getDirPath = () => `${__dirname}/../data`;

const main = () => {
  const eventEmitter = new events.EventEmitter();
  const dirWatcher = new DirWatcher(eventEmitter);
  const importer = new Importer(eventEmitter);

  dirWatcher.watch(getDirPath(), 2000);
}

main();
