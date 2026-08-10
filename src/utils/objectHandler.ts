export type ObjectWithKey<T> = Record<string, T>;

type ArrayItem = Record<string, any>;

const objectHandler = {
  toObject<T extends ArrayItem>(
    array: T[] = [],
    keyName: keyof T,
  ): ObjectWithKey<T> {
    const result: ObjectWithKey<T> = {};

    array.forEach((item) => {
      const key = item[keyName];
      if (!key) return;
      result[String(key)] = item;
    });

    return result;
  },
};

export default objectHandler;
