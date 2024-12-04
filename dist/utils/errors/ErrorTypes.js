class ErrorTypes {
    static createCustomError(message, name, statusCode) {
        const error = new Error();
        // If message is an object with public and inner properties
        if (typeof message === 'object' && 'public' in message) {
            error.message = message.public;
            // Optionally store inner details if needed
            error.inner = message.inner;
        }
        else {
            // If message is a simple string
            error.message = message;
        }
        error.name = name;
        error.statusCode = statusCode;
        return error;
    }
    // Static methods using the createCustomError helper
    static ValidationError(message) {
        return this.createCustomError(message, 'ValidationError', 400);
    }
    static AuthError(message) {
        return this.createCustomError(message, 'AuthError', 401);
    }
    static UnauthorizedAccess(message) {
        return this.createCustomError(message, 'UnauthorizedAccess', 403);
    }
    static NotFoundError(message) {
        return this.createCustomError(message, 'NotFoundError', 404);
    }
    static ConflictError(message) {
        return this.createCustomError(message, 'ConflictError', 409);
    }
    static ServerError(message) {
        return this.createCustomError(message, 'ServerError', 500);
    }
    static DatabaseError(message) {
        return this.createCustomError(message, 'DatabaseError', 500);
    }
}
export default ErrorTypes;
