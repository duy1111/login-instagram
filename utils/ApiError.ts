class ApiError extends Error {
  constructor(
    public msg: { en: string; ar: string },
    public statusCode: number
  ) {
    super();
  }
}

export default ApiError;
