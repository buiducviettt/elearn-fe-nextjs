const limitDigit = (value: number, limit: number = 2) => {
  return Math.round(value * Math.pow(10, limit)) / Math.pow(10, limit);
};
// random number between min and max
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const startPad = (number, padLength = 2) => {
  return number === 0 ? 0 : String(number).padStart(padLength, "0");
};

const numberHandler = {
  limitDigit,
  random,
  startPad,
};

export default numberHandler;
