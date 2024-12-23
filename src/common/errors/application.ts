export class ApplicationError extends Error {
  public recoverable?: boolean;
  public additionalInfo?: unknown;
  public response!: string;
  public code!: number;

  constructor(msg: string, additionalInfo?: unknown) {
    super(msg);
    this.message = msg;
    this.additionalInfo = additionalInfo;
  }

  static is(error: unknown): error is typeof this {
    return error instanceof ApplicationError;
  }
}
