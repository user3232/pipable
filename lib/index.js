// src/from-array.ts
function pipableArrayFrom(array) {
  return {
    get value() {
      return array;
    },
    toAsyncPipable
  };
  async function toAsyncPipable() {
    return asyncPipableArrayFrom(array);
  }
}
function asyncPipableArrayFrom(array) {
  const asyncArray = Array.isArray(array) ? Promise.all(array) : array;
  return {
    get value() {
      return asyncArray;
    },
    map
  };
  async function map(f) {
    return asyncPipableArrayFrom(
      (await asyncArray).map(f)
    );
  }
}

// src/from-object.ts
function pipableObjectFrom(object) {
  return {
    get value() {
      return object;
    },
    map,
    mapKey,
    mapKeyValue,
    filtermap,
    filtermapKeys,
    filterKeysTo,
    flatmap,
    toSortedByKey,
    filterToArray,
    mapToAsyncArray
  };
  function mapToAsyncArray(f) {
    const result = [];
    for (const [key, value] of Object.entries(object)) {
      const mapped = f(key, value);
      if (Array.isArray(mapped)) {
        result.push(...mapped);
      } else {
        result.push(Promise.resolve(mapped));
      }
    }
    return asyncPipableArrayFrom(result);
  }
  function filterToArray(f) {
    const result = [];
    for (const [key, value] of Object.entries(object)) {
      const mapped = f(key, value);
      if (mapped !== void 0) {
        if (Array.isArray(mapped)) {
          result.push(...mapped);
        } else {
          result.push(mapped);
        }
      }
    }
    return pipableArrayFrom(result);
  }
  function flatmap(f) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      const mapped = f(key, value);
      for (const [newKey, newValue] of Object.entries(mapped)) {
        result[newKey] = newValue;
      }
    }
    return pipableObjectFrom(result);
  }
  function toSortedByKey(compareFn) {
    const sortedKeys = Object.keys(object).sort(compareFn);
    const result = {};
    for (const key of sortedKeys) {
      result[key] = object[key];
    }
    return pipableObjectFrom(result);
  }
  function map(f) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      result[key] = f(key, value);
    }
    return pipableObjectFrom(result);
  }
  function mapKeyValue(fk, fv) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      const mappedKey = fk(key, value);
      const mappedValue = fv(key, value);
      result[mappedKey] = mappedValue;
    }
    return pipableObjectFrom(result);
  }
  function mapKey(f) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      const mappedKey = f(key, value);
      result[mappedKey] = value;
    }
    return pipableObjectFrom(result);
  }
  function filtermapKeys(f) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      const mappedKey = f(key, value);
      if (mappedKey !== void 0) {
        result[mappedKey] = value;
      }
    }
    return pipableObjectFrom(result);
  }
  function filtermap(f) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      const mapped = f(key, value);
      if (mapped !== void 0) {
        result[key] = mapped;
      }
    }
    return pipableObjectFrom(result);
  }
  function filterKeysTo(keys) {
    const keysSet = new Set(keys);
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      if (keysSet.has(key)) {
        result[key] = value;
      }
    }
    return pipableObjectFrom(result);
  }
}
export {
  asyncPipableArrayFrom,
  pipableArrayFrom,
  pipableObjectFrom
};
