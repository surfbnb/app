import EventEmitter from 'eventemitter3';

let BrowserEmitter = new EventEmitter();
let VideoPlayPauseEmitter = new EventEmitter();

export { BrowserEmitter, VideoPlayPauseEmitter };
