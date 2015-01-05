var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='../typings/bundle.d.ts' />
///<reference path='../../../dist/overworld.d.ts' />
var global = require('global');
global.Promise = require('bluebird');
global.Overworld = require('../../../lib');
var React = require('react');
Overworld.setReact(React);
global.portal = new Overworld.Portal;
var HelloContext = (function (_super) {
    __extends(HelloContext, _super);
    function HelloContext() {
        _super.apply(this, arguments);
    }
    HelloContext.component = React.createClass({
        mixins: [Overworld.mixinFor(function () { return portal; })],
        onClick: function () {
            this.emit('main:update', Date.now().toString());
        },
        render: function () {
            return React.createElement('div', { key: 'foo' }, [
                React.createElement('h1', { key: 'h1' }, 'App'),
                React.createElement('button', { key: '1', onClick: this.onClick }, 'click me'),
                React.createElement('p', { key: '2' }, this.props.body)
            ]);
        }
    });
    HelloContext.aggregator = function (pipe) {
        pipe.on('initState', function (props) { return ({ id: 'initial' }); });
        pipe.on('aggregate', function (props, state) { return ({ body: 'body of ' + state.id }); });
    };
    HelloContext.subscriber = function (subscribe) {
        subscribe('main:update', function (update) { return function (id) { return console.log(id); }; });
    };
    return HelloContext;
})(Overworld.Context);
portal.link('hello', HelloContext);
window.addEventListener('load', function () {
    portal.mount(document.body);
    portal.transition('hello', { id: 'foo' });
});
