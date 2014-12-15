///<reference path='../typings/bundle.d.ts' />

module overworld {
  declare var require: any;
  var Cortex = require('cortexjs/src/cortex');
  var React = require('react');
  var eeMixin = require('ee-mixin');
  var extend = require('extend');

  export function getComponentByName(sceneName: string) {
    throw 'override me';
  }

  export function getControllerByName(sceneName: string) {
    throw 'override me';
  }

  export function getEventsByName(sceneName: string) {
    throw 'override me';
  }

  export function getGlobalEmitter(): any {
    throw 'override me';
  }

  function initController(
    controller,
    params,
    parentComponent,
    childComponent
  ): Promise<any>{
    return new Promise(done => {
      Promise.resolve(
        controller.getInitialState(params)
      ).then(nextState => {
        Promise.resolve(
          controller.aggregate(nextState)
        ).then(nextViewModel => {
          parentComponent.setProps({
            Scene: childComponent,
            sceneViewModel: nextViewModel
          }, () => {
            Promise.resolve(
              controller.onCreate(params)
            ).then(()=> done(nextState));
          });
        })
      });
    });
  }

  var RootElement = React.createClass({
    mixins: [eeMixin],
    render: function(){
      var root;
      if(this.props.Scene) {
        root = this.props.Scene(extend({}, this.props.sceneViewModel));
      } else {
        root = React.createElement('div');
      }
      /*return React.createElement('div', {className: 'overworld-layout'}, [root]*/
      return root;
    }
  });

  // Root application
  export class Application {
    private currentController: Controller<any, any>;
    private rootCortex: any;
    private rootComponent: any;

    constructor() {
      this.currentController = null;
      this.rootComponent = React.render((RootElement({})), document.body);
      this.rootCortex = new Cortex({});
    }

    public disposeController(controller){
      if(!this.currentController) return;
      controller.onDispose();
      Object.freeze(controller);
    }

    public transition(sceneName:string, params: Object) {
      // dispose previous controller
      this.disposeController(this.currentController);
      var globalEmitter = overworld.getGlobalEmitter();
      globalEmitter.removeAllListeners('*')
      globalEmitter.removeAllListeners('*:*')

      this.rootCortex.off('update');

      var nextComponent = overworld.getComponentByName(sceneName);
      var nextController:any = overworld.getControllerByName(sceneName);

      this.currentController = new nextController(this.rootCortex);

      var events = overworld.getEventsByName(sceneName);
      this.currentController.delegateEvents(sceneName, events);

      initController(
        this.currentController, params,
        this.rootComponent, nextComponent
      ).then(nextState => {
        this.rootCortex.set(nextState);
        this.rootCortex.on('update', (state) => {
          this.onUpdate().then(state => {
          });
        });
      });
    }

    private onUpdate(): Promise<any>{
      return new Promise(done => {
        var state = this.rootCortex.val();
        Promise.resolve(
          this.currentController.aggregate(state)
        ).then(vm => {
          this.rootComponent.setProps({sceneViewModel: vm}, () => {
            done(state);
          });
        });
      });
    }
  }

  export class Controller<S, T> {
    public disposed: boolean;
    private childControllers: Controller<any, any>[];
    constructor(
      private cortex?: any
    ) {
      this.disposed = false;
      this.childControllers = [];
    }

    public addChildController(child: Controller<any, any>){
      this.childControllers.push(child);
    }

    public getState(): S {
      return this.cortex.val();
    }

    public delegateEvents(sceneName: string, events: any) {
      events.ctrl = this;
      var globalEmitter = overworld.getGlobalEmitter();
      var funcKeys = Object.keys(events).filter((key) => events[key] instanceof Function)
      funcKeys.forEach((fnKey) => {
        globalEmitter.on(sceneName+":"+fnKey, events[fnKey])
      });
    }

    public update(
      fn?: (t: S) => S
    ): void {
      if(!fn) fn = i => i;
      if(this.disposed) {
        console.warn('this controller is already disposed');
        return;
      }
      var val: S = this.cortex.val();
      var ret: S = fn(val);
      this.cortex.set(ret, true);
    }

    public onCreate(obj: Object): void {}

    public onDispose(): void {
      if(this.disposed) {
        console.warn('You disposed this instance more than twice');
        return;
      }
      this.disposed = true
    }

    public applyController(refName, controllerName){
    }

    public getInitialState(params: any): S | Promise<S> {
      throw 'override me';
    }

    public aggregate(state: S): T | Promise<T> {
      throw 'override me';
    }
  }
}

(module).exports = overworld;
