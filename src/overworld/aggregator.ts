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

  public initState(props: P): S{
    if(!this._map.initState) throw 'aggregate does not defined';
    return this._map.initState(props);
  }

  public aggregate(props: P, state: S): T{
    if(!this._map.aggregate) throw 'aggregate does not defined';
    return this._map.aggregate(props, state);
  }

  public buildTemplateProps(props: P, state?: S)
  : Promise<{props: P; state: S; templateProps: T;}>{
    return new Promise(done => {
      var stateContext = state ? state : this.initState(props);
      Promise.resolve(stateContext)
      .then(state => {
        Promise.resolve(this.aggregate(props, state))
        .then(templateProps => {
          done({props: props, state: state, templateProps: templateProps});
        });
      });
    });
  }
}

export = Aggregator;
