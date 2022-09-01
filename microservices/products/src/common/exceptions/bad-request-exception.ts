export class BadRequestException extends Error {
  private errors?: string[] | unknown[];

  constructor(message?: string, errorList?: string[] | unknown[]) {
    super(message);
    this.name = "BadRequestException";
    this.errors = errorList;

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
