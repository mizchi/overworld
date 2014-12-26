var utils = require('./utils/utils');
var Aggregator = require('./aggregator');
var LifeCycle = require('./lifecycle');
var subscribe = function (world) {
    return function (eventName, fn) {
        world.emitter.on(eventName, fn(world, world.props, world.state));
    };
};
var World = (function () {
    function World() {
        this._emitter = utils.createEmitter();
        this._build();
    }
    Object.defineProperty(World.prototype, "emitter", {
        get: function () {
            return this._emitter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "component", {
        get: function () {
            return this._component;
        },
        enumerable: true,
        configurable: true
    });
    World.prototype.init = function (props, state) {
        this._state = state;
        this._props = props;
    };
    World.prototype.update = function (state) {
        var _this = this;
        this._state = state;
        var build = this._aggregator.buildTemplateProps(this.props, this.state);
        Promise.resolve(build).then(function (params) {
            requestAnimationFrame(function () {
                _this._component.setProps(params.templateProps);
                _this.emitter.emit(LifeCycle.UPDATED);
            });
        });
    };
    Object.defineProperty(World.prototype, "aggregator", {
        get: function () {
            return this._aggregator;
        },
        enumerable: true,
        configurable: true
    });
    World.prototype.pause = function () {
        this.emitter.emit(LifeCycle.PAUSED);
    };
    World.prototype.resume = function () {
        this.emitter.emit(LifeCycle.RESUMED);
    };
    World.prototype.dispose = function () {
        this.emitter.emit(LifeCycle.DISPOSED);
    };
    World.prototype.renderTo = function (templateProps, el, component) {
        var _this = this;
        var React = utils.getReact();
        return new Promise(function (done) {
            if (component) {
                _this._component = component;
                _this._component.setProps(templateProps, function () {
                    _this.emitter.emit(LifeCycle.RESUMED);
                    done(component);
                });
            }
            else {
                var view = _this.render(templateProps);
                _this._component = React.render(view, el);
                _this.emitter.emit(LifeCycle.MOUNTED);
                done(_this._component);
            }
        });
    };
    World.prototype.render = function (templateProps) {
        var React = utils.getReact();
        return this._rootElement(templateProps);
    };
    World.prototype._build = function () {
        var React = utils.getReact();
        var self = this;
        //component
        this._rootElement = React.createFactory(self.constructor.component);
        //aggregator
        var aggregator = self.constructor.aggregator;
        if (aggregator)
            this._aggregator = new Aggregator(aggregator);
        //subscribe
        var subscriber = self.constructor.subscriber;
        if (subscriber) {
            this._subscriber = subscriber;
            this._subscriber(subscribe(this));
        }
    };
    return World;
})();
module.exports = World;
