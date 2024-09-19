export type PipableArray<V> = {
    readonly value: V[];
    toAsyncPipable(): Promise<AsyncPipableArray<V>>;
};
export declare function pipableArrayFrom<V>(array: V[]): PipableArray<V>;
export type AsyncPipableArray<V> = {
    readonly value: Promise<V[]>;
    map<MV>(f: (value: V, index: number) => MV): Promise<AsyncPipableArray<MV>>;
};
export declare function asyncPipableArrayFrom<V>(array: Promise<V[]> | (Promise<V> | V)[]): AsyncPipableArray<V>;
