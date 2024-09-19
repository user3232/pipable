import { AsyncPipableArray, asyncPipableArrayFrom, PipableArray, pipableArrayFrom } from "./from-array.js"



export type PipableObject<K extends string, V> = {
    readonly value: Record<K, V>,
    map<MV>(
        f: (key: K, value: V) => MV
    ): PipableObject<K, MV>,
    mapKey<MK extends string>(
        f: (key: K, value: V) => MK
    ): PipableObject<MK, V>,
    mapKeyValue<MK extends K, MV>(
        fk: (key: K, value: V) => MK, 
        fv: (key: K, value: V) => MV
    ): PipableObject<MK, MV>,
    filtermap<MV>(
        f: (key: K, value: V) => MV | undefined
    ): PipableObject<string, MV>,
    filtermapKeys<MK extends string>(
        f: (key: K, value: V) => MK | undefined
    ): PipableObject<MK, V>,
    filterKeysTo(
        keys: string[]
    ): PipableObject<string, V>,
    flatmap<MV>(
        f: (key: K, value: V) => Record<string, MV>
    ): PipableObject<string, MV>,

    toSortedByKey(
        compareFn?: ((a: string, b: string) => number) | undefined
    ): PipableObject<K, V>,

    filterToArray<MV>(
        f: (key: K, value: V) => MV | MV[] | undefined
    ): PipableArray<MV>,

    mapToAsyncArray<MV>(
        f: (key: K, value: V) => MV | Promise<MV> | (Promise<MV> | MV)[]
    ): AsyncPipableArray<MV>
}

export function pipableObjectFrom<K extends string, V>(
    object: Record<K, V>
): PipableObject<K, V> {

    return {
        get value() { return object },
        map,
        mapKey,
        mapKeyValue,
        filtermap,
        filtermapKeys,
        filterKeysTo,
        flatmap,
        
        toSortedByKey,

        filterToArray,
        mapToAsyncArray,
    }


    function mapToAsyncArray<MV>(
        f: (key: K, value: V) => MV | Promise<MV> | (Promise<MV> | MV)[]
    ) {
        const result: (Promise<MV> | MV)[] = []
        for(const [key, value] of Object.entries<V>(object)) {
            const mapped = f(key as K, value)
            if(Array.isArray(mapped)) {
                result.push(...mapped)
            }
            else {
                result.push(Promise.resolve(mapped))
            }
        }
        return asyncPipableArrayFrom(result)
    }

    function filterToArray<MV>(
        f: (key: K, value: V) => MV | MV[] | undefined
    ) {
        const result: MV[] = []
        for(const [key, value] of Object.entries<V>(object)) {
            const mapped = f(key as K, value)
            if(mapped !== undefined) {
                if(Array.isArray(mapped)) {
                    result.push(...mapped)
                }
                else {
                    result.push(mapped)
                }
            }
        }
        return pipableArrayFrom(result)
    }

    function flatmap<MV>(
        f: (key: K, value: V) => Record<string, MV>
    ): PipableObject<string, MV> {
        const result: Record<string, MV> = {}
        for(const [key, value] of Object.entries<V>(object)) {
            const mapped = f(key as K, value)
            for(const [newKey, newValue] of Object.entries(mapped)) {
                result[newKey] = newValue
            }
        }
        return pipableObjectFrom(result)
    }


    function toSortedByKey(
        compareFn?: ((a: string, b: string) => number) | undefined
    ): PipableObject<K, V> {
        const sortedKeys = Object.keys(object).sort(compareFn)
        const result = {} as Record<K, V>
        for(const key of sortedKeys) {
            result[key as K] = object[key as K]
        }
        return pipableObjectFrom(result)
    }


    function map<MV>(
        f: (key: K, value: V) => MV
    ): PipableObject<K, MV> {
        const result = {} as Record<K, MV>
        for(const [key, value] of Object.entries<V>(object)) {
            result[key as K] = f(key as K, value)
        }
        return pipableObjectFrom(result)
    }

    function mapKeyValue<MK extends K, MV>(
        fk: (key: K, value: V) => MK,
        fv: (key: K, value: V) => MV,
    ): PipableObject<MK, MV> {
        const result = {} as Record<MK, MV>
        for(const [key, value] of Object.entries<V>(object)) {
            const mappedKey = fk(key as K, value)
            const mappedValue = fv(key as K, value)
            result[mappedKey] = mappedValue
        }
        return pipableObjectFrom(result)
    }


    function mapKey<MK extends string>(
        f: (key: K, value: V) => MK
    ): PipableObject<MK, V> {
        const result = {} as Record<MK, V>
        for(const [key, value] of Object.entries<V>(object)) {
            const mappedKey = f(key as K, value)
            result[mappedKey] = value
        }
        return pipableObjectFrom(result)
    }


    function filtermapKeys<MK extends string>(
        f: (key: K, value: V) => MK | undefined
    ): PipableObject<MK, V> {
        const result = {} as Record<MK, V>
        for(const [key, value] of Object.entries<V>(object)) {
            const mappedKey = f(key as K, value)
            if(mappedKey !== undefined) {
                result[mappedKey] = value
            }
        }
        return pipableObjectFrom(result)
    }

    function filtermap<MV>(
        f: (key: K, value: V) => MV | undefined
    ): PipableObject<string, MV> {
        const result = {} as Record<string, MV>
        for(const [key, value] of Object.entries<V>(object)) {
            const mapped = f(key as K, value)
            if(mapped !== undefined) {
                result[key] = mapped
            }
        }
        return pipableObjectFrom(result)
    }

    function filterKeysTo(
        keys: string[]
    ): PipableObject<string, V> {
        const keysSet = new Set(keys)
        const result = {} as Record<string, V>
        for(const [key, value] of Object.entries<V>(object)) {
            if(keysSet.has(key)) {
                result[key] = value
            }
        }
        return pipableObjectFrom(result)
    }
}

