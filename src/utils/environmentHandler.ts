const environmentHandler = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  isClient() {
    return typeof window !== "undefined";
  },
};

export default environmentHandler;
