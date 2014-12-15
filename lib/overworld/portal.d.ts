declare class Portal {
    _linkMap: any;
    _caches: any;
    el: HTMLElement;
    private _nodes;
    private _cursor;
    private _activeNode;
    constructor();
    getActiveEmitter(): any;
    link(name: any, world: any): void;
    private buildLinkNode(name, forceCreate?);
    private renderNode(node, props, component);
    private resumeNode(node);
    mount(el: any): void;
    transition(name: any, props: any): Promise<any>;
    pushWorld(name: any, props: any): Promise<{}>;
    popWorld(resumeParams?: any): Promise<{}>;
    serialize(): {
        props: any;
        state: any;
        type: string;
    }[];
}
export = Portal;
