const debounce = (mlSeconds: number = 500) => {
  let timeoutId: NodeJS.Timeout;
  return (cb) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(cb, mlSeconds);
  };
};

const performanceHandler = {
  debounce,
};

export default performanceHandler;
