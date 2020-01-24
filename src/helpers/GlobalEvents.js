import EventEmitter from "eventemitter3";

export const globalEvents = new EventEmitter();

export const globalEventsMap = {
    oAuthCancel : "onOAuthCancel",
    oAuthError : "onOAuthError"
}
