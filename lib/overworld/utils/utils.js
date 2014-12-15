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
    return _react; //TODO return global react as default
}
exports.getReact = getReact;
function setImmutable(imm) {
    _immutable = imm;
}
exports.setImmutable = setImmutable;
function getImmutable() {
    return _immutable; //TODO return global react as default
}
exports.getImmutable = getImmutable;
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
    return new EventEmitter({ wildcard: true, delimiter: ':' });
}
exports.createEmitter = createEmitter;
function uuid() {
    return Date.now().toString() + '-' + (~~(Math.random() * 10000)).toString();
}
exports.uuid = uuid;
/*export function createRootElement() {
  var React = getReact();
  return React.createClass({
    render: function(){
      if(this.props.scene) {
        return this.props.scene(this.props.viewmodel);
      } else {
        return React.createElement('div', {key: '_none_'});
      }
    }
  });
}*/
