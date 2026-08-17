import { ClientError } from "./clientError";

export class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}
