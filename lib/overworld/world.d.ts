import Aggregator = require('./aggregator');
declare class World {
    static aggregator: any;
    static component: any;
    static subscriber: Function;
    private _aggregator;
    private _rootElement;
    private _component;
    private _emitter;
    private _subscriber;
    constructor();
    emitter: any;
    private _props;
    props: any;
    private _state;
    state: any;
    component: any;
    init(props: any, state: any): void;
    update(updater: any): void;
    aggregator: Aggregator<any, any, any>;
    pause(): void;
    resume(): void;
    dispose(): void;
    private injectContextProperties(templateProps);
    renderTo(templateProps: any, el: any, component?: any): Promise<any>;
    render(templateProps: any): any;
    private _build();
}
export = World;
