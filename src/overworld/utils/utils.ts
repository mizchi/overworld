var _react;
var _immutable;
var EventEmitter = require('eventemitter2');
type EventEmitter = EventEmitter2;
if(EventEmitter.EventEmitter2) EventEmitter = EventEmitter.EventEmitter2;

export function setReact(react): any {
  _react = react;
}

declare var React: any;
export function getReact(): any {
  if(_react) {
    return _react;
  }

  if(typeof React !== 'undefined') {
    return React;
  }
  else {
    throw 'Overworld cant reach React'
  }
}

export function createContainer(): any {
  if(typeof window === 'object') {
    return window.document.createElement('div');
  } else {
    return {};
  }
}

export function createEmitter(): any {
  return new EventEmitter();
}

export function uuid(): string {
  return Date.now().toString() + '-' + (~~(Math.random() * 10000)).toString();
}
