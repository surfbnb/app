import EventEmitter from 'eventemitter3';

let BrowserEmitter = new EventEmitter();
let VideoPlayPauseEmitter = new EventEmitter();
let DrawerEmitter = new EventEmitter();

export { BrowserEmitter, VideoPlayPauseEmitter, DrawerEmitter };
