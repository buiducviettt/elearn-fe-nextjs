export const startPad = (number) => {
  return number === 0 ? 0 : String(number).padStart(2, "0");
};
