// This class is real Aggregator instance
// but user was given IAggregator
class Aggregator<P, S, T>{
  private _map:any;

  constructor(private aggregateFn: any) {
    this._map = {};
    aggregateFn(this);
  }

  public on(eventName: string, fn: Function){
    if(this._map[eventName]) throw 'doubled:'+eventName;
    this._map[eventName] = fn;
    return this;
  }

  public init(props: P): S{
    if(!this._map.init) throw 'aggregate does not defined';
    return this._map.init(props);
  }

  public aggregate(props: P, state: S){
    if(!this._map.aggregate) throw 'aggregate does not defined';
    return this._map.aggregate(props, state);
  }
}

export = Aggregator;
