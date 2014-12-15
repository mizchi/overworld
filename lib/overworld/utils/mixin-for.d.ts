declare function mixinFor(portal: any): {
    emit: (eventName: string, ...args: any[]) => void;
};
export = mixinFor;
