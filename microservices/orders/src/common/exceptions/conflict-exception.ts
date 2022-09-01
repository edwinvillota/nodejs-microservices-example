export class ConflictException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ConflictException";
    this.message = String(message);

    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
