import IAggregator = require('./interfaces/aggregator');
declare class Aggregator<P, S, T> {
    aggregator: IAggregator<P, S, T>;
    constructor(aggregator: any);
    private callInitState(props);
    private callAggregate(props, state?);
    buildTemplateProps(props: P, forceState?: S): Promise<{
        props: P;
        state: S;
        templateProps: T;
    }>;
}
export = Aggregator;
