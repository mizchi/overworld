interface IAggregator<P, S, T> {
    initState?(props: P): Promise<S> | S;
    aggregate(props: P, state: S): Promise<T> | T;
}
export = IAggregator;
