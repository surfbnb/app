import EventEmitter from 'eventemitter3';
let VideoPlayPauseEmitter = new EventEmitter();
let DrawerEmitter = new EventEmitter();
let VideoReplyEmitter = new EventEmitter();
let LoggedOutCustomTabClickEvent = new EventEmitter();
let TwitterAuthEmitter = new EventEmitter();
let GithubAuthEmitter = new EventEmitter();
let AppleAuthEmitter = new EventEmitter();


export { VideoPlayPauseEmitter, DrawerEmitter, VideoReplyEmitter,
     LoggedOutCustomTabClickEvent, TwitterAuthEmitter, GithubAuthEmitter,
     AppleAuthEmitter };
