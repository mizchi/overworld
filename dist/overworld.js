///<reference path='../typings/bundle.d.ts' />
var overworld;
(function (overworld) {
    var Cortex = require('cortexjs/src/cortex');
    var React = require('react');
    var eeMixin = require('ee-mixin');
    var extend = require('extend');
    function getComponentByName(sceneName) {
        throw 'override me';
    }
    overworld.getComponentByName = getComponentByName;
    function getControllerByName(sceneName) {
        throw 'override me';
    }
    overworld.getControllerByName = getControllerByName;
    function getEventsByName(sceneName) {
        throw 'override me';
    }
    overworld.getEventsByName = getEventsByName;
    function getGlobalEmitter() {
        throw 'override me';
    }
    overworld.getGlobalEmitter = getGlobalEmitter;
    function initController(controller, params, parentComponent, childComponent) {
        return new Promise(function (done) {
            Promise.resolve(controller.getInitialState(params)).then(function (nextState) {
                Promise.resolve(controller.aggregate(nextState)).then(function (nextViewModel) {
                    parentComponent.setProps({
                        Scene: childComponent,
                        sceneViewModel: nextViewModel
                    }, function () {
                        Promise.resolve(controller.onCreate(params)).then(function () { return done(nextState); });
                    });
                });
            });
        });
    }
    var RootElement = React.createClass({
        mixins: [eeMixin],
        render: function () {
            var root;
            if (this.props.Scene) {
                root = this.props.Scene(extend({}, this.props.sceneViewModel));
            }
            else {
                root = React.createElement('div');
            }
            /*return React.createElement('div', {className: 'overworld-layout'}, [root]*/
            return root;
        }
    });
    // Root application
    var Application = (function () {
        function Application() {
            this.currentController = null;
            this.rootComponent = React.render((RootElement({})), document.body);
            this.rootCortex = new Cortex({});
        }
        Application.prototype.disposeController = function (controller) {
            if (!this.currentController)
                return;
            controller.onDispose();
            Object.freeze(controller);
        };
        Application.prototype.transition = function (sceneName, params) {
            var _this = this;
            // dispose previous controller
            this.disposeController(this.currentController);
            var globalEmitter = overworld.getGlobalEmitter();
            globalEmitter.removeAllListeners('*');
            globalEmitter.removeAllListeners('*:*');
            this.rootCortex.off('update');
            var nextComponent = overworld.getComponentByName(sceneName);
            var nextController = overworld.getControllerByName(sceneName);
            this.currentController = new nextController(this.rootCortex);
            var events = overworld.getEventsByName(sceneName);
            this.currentController.delegateEvents(sceneName, events);
            initController(this.currentController, params, this.rootComponent, nextComponent).then(function (nextState) {
                _this.rootCortex.set(nextState);
                _this.rootCortex.on('update', function (state) {
                    _this.onUpdate().then(function (state) {
                    });
                });
            });
        };
        Application.prototype.onUpdate = function () {
            var _this = this;
            return new Promise(function (done) {
                var state = _this.rootCortex.val();
                Promise.resolve(_this.currentController.aggregate(state)).then(function (vm) {
                    _this.rootComponent.setProps({ sceneViewModel: vm }, function () {
                        done(state);
                    });
                });
            });
        };
        return Application;
    })();
    overworld.Application = Application;
    var Controller = (function () {
        function Controller(cortex) {
            this.cortex = cortex;
            this.disposed = false;
            this.childControllers = [];
        }
        Controller.prototype.addChildController = function (child) {
            this.childControllers.push(child);
        };
        Controller.prototype.getState = function () {
            return this.cortex.val();
        };
        Controller.prototype.delegateEvents = function (sceneName, events) {
            events.ctrl = this;
            var globalEmitter = overworld.getGlobalEmitter();
            var funcKeys = Object.keys(events).filter(function (key) { return events[key] instanceof Function; });
            funcKeys.forEach(function (fnKey) {
                globalEmitter.on(sceneName + ":" + fnKey, events[fnKey]);
            });
        };
        Controller.prototype.update = function (fn) {
            if (!fn)
                fn = function (i) { return i; };
            if (this.disposed) {
                console.warn('this controller is already disposed');
                return;
            }
            var val = this.cortex.val();
            var ret = fn(val);
            this.cortex.set(ret, true);
        };
        Controller.prototype.onCreate = function (obj) {
        };
        Controller.prototype.onDispose = function () {
            if (this.disposed) {
                console.warn('You disposed this instance more than twice');
                return;
            }
            this.disposed = true;
        };
        Controller.prototype.applyController = function (refName, controllerName) {
        };
        Controller.prototype.getInitialState = function (params) {
            throw 'override me';
        };
        Controller.prototype.aggregate = function (state) {
            throw 'override me';
        };
        return Controller;
    })();
    overworld.Controller = Controller;
})(overworld || (overworld = {}));
(module).exports = overworld;
