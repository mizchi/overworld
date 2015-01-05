declare class Portal {
    _linkMap: any;
    _caches: any;
    el: HTMLElement;
    private _nodes;
    private _cursor;
    constructor();
    private activeNode;
    getActiveEmitter(): any;
    link(name: any, world: any): void;
    private buildLinkNode(name, forceCreate?);
    private renderNode(node, props, component);
    private resumeNode(node);
    mount(el: any): void;
    transition(name: any, props: any): Promise<any>;
    pushScene(name: any, props: any): Promise<{}>;
    popScene(resumeParams?: any): Promise<{}>;
    serialize(): {
        props: any;
        state: any;
        type: string;
    }[];
}
export = Portal;
