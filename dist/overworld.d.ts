/// <reference path="../typings/bundle.d.ts" />
declare module overworld {
    function getComponentByName(sceneName: string): void;
    function getControllerByName(sceneName: string): void;
    function getEventsByName(sceneName: string): void;
    function getGlobalEmitter(): any;
    class Application {
        private currentController;
        private rootCortex;
        private rootComponent;
        constructor();
        disposeController(controller: any): void;
        transition(sceneName: string, params: Object): void;
        private onUpdate();
    }
    class Controller<S, T> {
        private cortex;
        disposed: boolean;
        private childControllers;
        constructor(cortex?: any);
        addChildController(child: Controller<any, any>): void;
        getState(): S;
        delegateEvents(sceneName: string, events: any): void;
        update(fn?: (t: S) => S): void;
        onCreate(obj: Object): void;
        onDispose(): void;
        applyController(refName: any, controllerName: any): void;
        getInitialState(params: any): S | Promise<S>;
        aggregate(state: S): T | Promise<T>;
    }
}
