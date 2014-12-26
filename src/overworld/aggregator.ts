// This class is real Aggregator instance
// but user was given IAggregator

import IAggregator = require('./interfaces/aggregator');

class Aggregator<P, S, T>{
  aggregator: IAggregator<P, S, T>
  constructor(aggregator: any) {
    if(!aggregator.aggregate && aggregator instanceof Function)
      this.aggregator = new aggregator();
    else
      this.aggregator = aggregator;
    if(!this.aggregator.aggregate) throw 'aggregate does not defined';
  }

  private callInitState(props){
    if(this.aggregator.initState instanceof Function)
      return this.aggregator.initState(props);
  }

  private callAggregate(props: P, state?: S){
    return this.aggregator.aggregate(props, state);
  }

  public buildTemplateProps(props: P, forceState?: S)
  : Promise<{props: P; state: S; templateProps: T;}>{
    return new Promise(done => {
      var state = forceState ? forceState : this.callInitState(props);
      Promise.resolve(state).then(nextState => {
        var templateProps:any = this.callAggregate(props, <any>nextState);

        Promise.resolve(templateProps).then(nextTemplateProps => {
          done({props: props, state: nextState, templateProps: nextTemplateProps});
        });
      });
    });
  }
}

export = Aggregator;
