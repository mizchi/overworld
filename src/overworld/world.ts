import utils = require('./utils/utils');
import Aggregator = require('./aggregator');
import Emittable = require('./interfaces/emittable')
import LifeCycle = require('./lifecycle');

var subscribe: (world: World) => any = (world) => {
  return (eventName: string, fn: (update: Function, props?: any, state?: any) => (...args: any[]) => void) => {
    world.emitter.on(eventName, fn(world.update.bind(world), world.props, world.state));
  }
};

class World {
  static aggregator: any;
  static component: any;
  static subscriber: Function;

  private _aggregator: Aggregator<any, any, any>;
  private _rootElement: any;
  private _component: any;
  private _emitter: any;
  private _subscriber: any;

  constructor(){
    this._emitter = utils.createEmitter();
    this._build();
  }

  public get emitter() {return this._emitter;}

  // State and Props
  private _props: any;
  public get props(){return this._props;}
  private _state: any;
  public get state(){return this._state;}

  public get component(){return this._component;}

  public init(props, state){
    this._state = state;
    this._props = props;
  }

  public update(state){
    this._state = state;
    var templateProps = this._aggregator.aggregate(this.props, this.state)
    requestAnimationFrame(() => {
      this._component.setProps(templateProps)
      this.emitter.emit(LifeCycle.UPDATED);
    });
  }

  public get aggregator(): Aggregator<any, any, any> {return this._aggregator;}

  public pause() {
    this.emitter.emit(LifeCycle.PAUSED);
  }

  public resume() {
    this.emitter.emit(LifeCycle.RESUMED);
  }

  public dispose() {
    this.emitter.emit(LifeCycle.DISPOSED);
  }

  public renderTo(templateProps, el: any, component?: any): Promise<any> {
    var React = utils.getReact();
    return new Promise(done => {
      if(component) {
        this._component = component;
        this._component.setProps(templateProps, () => {
          this.emitter.emit(LifeCycle.RESUMED);
          done(component)
        });
      } else {
        var view = this._render(templateProps);
        this._component = React.render(view, el);
        this.emitter.emit(LifeCycle.MOUNTED);
        done(this._component)
      }
    });
  }

  private _render(templateProps: any) {
    var React = utils.getReact();
    return this._rootElement(templateProps);
  }

  private _build(): void{
    var React = utils.getReact();
    var self:any = this;

    //component
    this._rootElement = React.createFactory(self.constructor.component);

    //aggregator
    var aggregator = self.constructor.aggregator;
    this._aggregator = new Aggregator(aggregator);

    //subscribe
    this._subscriber = self.constructor.subscriber;

    this._subscriber( subscribe(this) );
  }
}

export = World;
