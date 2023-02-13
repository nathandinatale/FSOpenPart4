// Validation errors are handled by just returning the error message as json
class MissingIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class PasswordTooShortError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

module.exports = { MissingIdError, PasswordTooShortError };
