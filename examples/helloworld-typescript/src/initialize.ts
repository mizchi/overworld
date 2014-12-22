///<reference path='../typings/bundle.d.ts' />
///<reference path='../../../dist/overworld.d.ts' />
declare module Overworld {
  export class Portal {
  }
  export class World {
  }
  export var setReact: any;
  export var mixinFor: any;
  export var utils: any;
}

var global = require('global');
global.Promise = require('bluebird');
global.Overworld = require('../../../lib');

var React = require('react');
Overworld.setReact(React);

declare var portal;
global.portal = new Overworld.Portal

class HelloWorld extends Overworld.World {
  static component = React.createClass({
    mixins: [Overworld.mixinFor( ()=> portal)],
    onClick: function(){this.emit('main:update', Date.now().toString());},
    render: function(){
      return React.createElement('div', {key: 'foo'}, [
        React.createElement('h1', {key: 'h1'}, 'App'),
        React.createElement('button', {key: '1', onClick: this.onClick}, 'click me'),
        React.createElement('p', {key: '2'}, this.props.body)
      ]);
    }
  });

  static aggregator = (pipe) => {
    pipe.on('initState', (props) => ({id: 'initial'}));
    pipe.on('aggregate', (props, state) => ({body: 'body of '+state.id}));
  }

  static subscriber = (subscribe) => {
    subscribe('main:update', (update) => (id) => console.log(id));
  }
}

portal.link('hello', HelloWorld);
window.addEventListener('load', () => {
  portal.mount(document.body);
  portal.transition('hello', {id: 'foo'});
});
