interface IAggregator<P, S, T> {
  on(eventName: string, fn: Function): any;
  on(eventName: "init", fn: (props: P) => S | Promise<S>): IAggregator<P, S, T>;
  on(eventName: "aggregate", fn: (props: P, state: S) => T | Promise<T>): IAggregator<P, S, T>;
}
export = IAggregator;
