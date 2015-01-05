var _react;
var _immutable;
var EventEmitter = require('eventemitter2');
if (EventEmitter.EventEmitter2)
    EventEmitter = EventEmitter.EventEmitter2;
function setReact(react) {
    _react = react;
}
exports.setReact = setReact;
function getReact() {
    if (_react) {
        return _react;
    }
    if (typeof React !== 'undefined') {
        return React;
    }
    else {
        throw 'Overworld cant reach React';
    }
}
exports.getReact = getReact;
function createContainer() {
    if (typeof window === 'object') {
        return window.document.createElement('div');
    }
    else {
        return {};
    }
}
exports.createContainer = createContainer;
function createEmitter() {
    return new EventEmitter();
}
exports.createEmitter = createEmitter;
function uuid() {
    return Date.now().toString() + '-' + (~~(Math.random() * 10000)).toString();
}
exports.uuid = uuid;
