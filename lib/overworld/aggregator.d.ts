declare class Aggregator<P, S, T> {
    aggregator: any;
    constructor(aggregator: any);
    callInitState(props: any): any;
    callAggregate(props: P, state?: S): any;
    buildTemplateProps(props: P, forceState?: S): Promise<{
        props: P;
        state: S;
        templateProps: T;
    }>;
}
export = Aggregator;
