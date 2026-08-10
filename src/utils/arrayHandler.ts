const arrayHandler = {
  toArray(object) {
    return Object.values(object);
  },
  // sum
  sum(arr: number[]) {
    return arr.reduce((acc, curr) => acc + curr, 0);
  },
};

export default arrayHandler;
