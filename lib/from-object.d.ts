import { AsyncPipableArray, PipableArray } from "./from-array.js";
export type PipableObject<K extends string, V> = {
    readonly value: Record<K, V>;
    map<MV>(f: (key: K, value: V) => MV): PipableObject<K, MV>;
    mapKey<MK extends string>(f: (key: K, value: V) => MK): PipableObject<MK, V>;
    mapKeyValue<MK extends K, MV>(fk: (key: K, value: V) => MK, fv: (key: K, value: V) => MV): PipableObject<MK, MV>;
    filtermap<MV>(f: (key: K, value: V) => MV | undefined): PipableObject<string, MV>;
    filtermapKeys<MK extends string>(f: (key: K, value: V) => MK | undefined): PipableObject<MK, V>;
    filterKeysTo(keys: string[]): PipableObject<string, V>;
    flatmap<MV>(f: (key: K, value: V) => Record<string, MV>): PipableObject<string, MV>;
    toSortedByKey(compareFn?: ((a: string, b: string) => number) | undefined): PipableObject<K, V>;
    filterToArray<MV>(f: (key: K, value: V) => MV | MV[] | undefined): PipableArray<MV>;
    mapToAsyncArray<MV>(f: (key: K, value: V) => MV | Promise<MV> | (Promise<MV> | MV)[]): AsyncPipableArray<MV>;
};
export declare function pipableObjectFrom<K extends string, V>(object: Record<K, V>): PipableObject<K, V>;
