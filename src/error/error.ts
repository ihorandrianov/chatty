export class NetError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super();
  }
}
