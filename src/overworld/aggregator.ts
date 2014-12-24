// This class is real Aggregator instance
// but user was given IAggregator

interface IAggregator<P, S, T> {
  initState(p: P): S | Promise<S> ;
  aggregate(p: P, s?: S): T | Promise<T>;
}

class Aggregator<P, S, T>{
  constructor(public aggregator: any) {
    if(!aggregator.aggregate && aggregator instanceof Function)
      this.aggregator = new aggregator();
  }

  public callInitState(props){
    if(this.aggregator.initState instanceof Function)
      return this.aggregator.initState(props);
  }

  public callAggregate(props: P, state?: S){
    if(!this.aggregator.aggregate) throw 'aggregate does not defined';
    return this.aggregator.aggregate(props, state);
  }

  public buildTemplateProps(props: P, forceState?: S)
  : Promise<{props: P; state: S; templateProps: T;}>{
    return new Promise(done => {
      var state = forceState ? forceState : this.callInitState(props);
      Promise.resolve(state).then(nextState => {
        var templateProps = this.callAggregate(props, nextState);
        Promise.resolve(templateProps).then(nextTemplateProps => {
          done({props: props, state: nextState, templateProps: nextTemplateProps});
        });
      });
    });
  }
}

export = Aggregator;
