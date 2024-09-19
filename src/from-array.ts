


export type PipableArray<V> = {
    readonly value: V[],

    toAsyncPipable(): Promise<AsyncPipableArray<V>>,
}


export function pipableArrayFrom<V>(
    array: V[],
): PipableArray<V> {


    return {
        get value(): V[] { return array },
        toAsyncPipable,
    }



    async function toAsyncPipable() {
        return asyncPipableArrayFrom(array)
    }
}



export type AsyncPipableArray<V> = {
    readonly value: Promise<V[]>,

    map<MV>(f: (value: V, index: number) => MV): Promise<AsyncPipableArray<MV>>,
}


export function asyncPipableArrayFrom<V>(
    array: Promise<V[]> | (Promise<V> | V)[]
): AsyncPipableArray<V> {

    const asyncArray: Promise<V[]> = Array.isArray(array)
        ? Promise.all(array)
        : array
    
    
    return {
        get value() { return asyncArray },

        map,
    }

    async function map<MV>(
        f: (value: V, index: number) => MV
    ) {
        return asyncPipableArrayFrom(
            (await asyncArray).map(f)
        )
    }
}