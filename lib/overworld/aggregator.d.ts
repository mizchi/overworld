declare class Aggregator<P, S, T> {
    private aggregateFn;
    private _map;
    constructor(aggregateFn: any);
    on(eventName: string, fn: Function): Aggregator<P, S, T>;
    initState(props: P): S;
    aggregate(props: P, state: S): T;
    buildTemplateProps(props: P, state?: S): Promise<{
        props: P;
        state: S;
        templateProps: T;
    }>;
}
export = Aggregator;
