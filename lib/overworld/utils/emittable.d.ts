export = Emittable;
declare var Emittable: {
    _getEmitter: () => any;
    emit: (eventName: string, ...args: any[]) => void;
};
