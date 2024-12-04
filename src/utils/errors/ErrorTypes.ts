interface CustomErrorMessage {
    public: string;
    inner?: any;
  }
  
  interface CustomError extends Error {
    statusCode?: number;
  }
  
  
class ErrorTypes {
    private static createCustomError(
        message: string | CustomErrorMessage, 
        name: string, 
        statusCode: number
      ): CustomError {
        const error = new Error() as CustomError;
      
        // If message is an object with public and inner properties
        if (typeof message === 'object' && 'public' in message) {
          error.message = message.public;
          // Optionally store inner details if needed
          (error as any).inner = message.inner;
        } else {
          // If message is a simple string
          error.message = message as string;
        }
      
        error.name = name;
        error.statusCode = statusCode;
        return error;
      }
  
    // Static methods using the createCustomError helper
    static ValidationError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'ValidationError', 400);
    }
  
    static AuthError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'AuthError', 401);
    }
  
    static UnauthorizedAccess(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'UnauthorizedAccess', 403);
    }
  
    static NotFoundError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'NotFoundError', 404);
    }
  
    static ConflictError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'ConflictError', 409);
    }
  
    static ServerError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'ServerError', 500);
    }
  
    static DatabaseError(message: string | CustomErrorMessage) {
      return this.createCustomError(message, 'DatabaseError', 500);
    }
  }
  
  export default ErrorTypes 