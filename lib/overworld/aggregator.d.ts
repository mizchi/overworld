declare class Aggregator<P, S, T> {
    private aggregateFn;
    private _map;
    constructor(aggregateFn: any);
    on(eventName: string, fn: Function): Aggregator<P, S, T>;
    init(props: P): S;
    aggregate(props: P, state: S): any;
}
export = Aggregator;
