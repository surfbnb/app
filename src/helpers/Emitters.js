import EventEmitter from 'eventemitter3';
let VideoPlayPauseEmitter = new EventEmitter();
let DrawerEmitter = new EventEmitter();
let VideoReplyEmitter = new EventEmitter();
let LoggedOutCustomTabClickEvent = new EventEmitter();
let LowMemoryEmitter = new EventEmitter();

export { VideoPlayPauseEmitter, DrawerEmitter, VideoReplyEmitter, LoggedOutCustomTabClickEvent, LowMemoryEmitter };
