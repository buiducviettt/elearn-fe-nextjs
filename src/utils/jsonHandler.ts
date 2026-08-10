const jsonHandler = {
  parse: <T = any>(data, defaultValue: any): T => {
    try {
      return JSON.parse(data) || defaultValue;
    } catch {
      return defaultValue;
    }
  },
};

export default jsonHandler;
