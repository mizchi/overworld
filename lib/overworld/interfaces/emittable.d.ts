export interface Emittable {
    emit: (name: string, ...args: any[]) => void;
}
