declare module Overworld {
  export interface Thenable<R> {
    then<U>(onFulfilled?: (value: R) => Thenable<U>,  onRejected?: (error: any) => Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => Thenable<U>, onRejected?: (error: any) => U): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U, onRejected?: (error: any) => Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U, onRejected?: (error: any) => U): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U, onRejected?: (error: any) => void): Thenable<U>;
  }

  export var LifeCycle: {
    CREATED:   string;
    UPDATED:   string;
    MOUNTED:   string;
    UNMOUNTED: string;
    PAUSED:    string;
    RESUMED:   string;
    DISPOSED:  string;
  };

  export class Portal {
    mount(el: HTMLElement): void;
    transition(name: string, arg: any): Thenable<any>;
  }

  export class Context<A, B> {
    component: any;
    props: A;
    state: B;
    update(): void;
    update(obj: B): void;
    update(fn: (t: B)=> B): void;
  }

  export interface IAggregator<P, S, T>{
    initState(p: P): S | Thenable<S>;
    aggregate(p: P, s: S): T | Thenable<T>;
  }

  export var Emittable: any;
  export var setReact: (v: any) => void;
  export var utils: any;

  export function subscriber<A, B>(
    fn: (
      subscribe: (
        name: string,
        fn: (context: Context<A, B>) => (...args: any[]) => void) => void
    ) => void
  ): (
    fn: (
      subscribe: (
        name: string,
        fn: (context: Context<A, B>) => (...args: any[]) => void) => void
      ) => void
    ) => void;
}
