var _react;
var _immutable;
var EventEmitter = require('eventemitter2');
type EventEmitter = EventEmitter2;
if(EventEmitter.EventEmitter2) EventEmitter = EventEmitter.EventEmitter2;

// alias map

export var mixinAliasMap = {};
export function aliasForMixin(key, instance): any {
  mixinAliasMap[key] = instance;
}

export function setReact(react): any {
  _react = react;
}

export function getReact(): any {
  return _react; //TODO return global react as default
}

export function setImmutable(imm): any {
  _immutable = imm;
}

export function getImmutable(): any {
  return _immutable; //TODO return global react as default
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
  /*return new EventEmitter({wildcard: true, delimiter: ':'});*/
}

export function uuid(): string {
  return Date.now().toString() + '-' + (~~(Math.random() * 10000)).toString();
}

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
