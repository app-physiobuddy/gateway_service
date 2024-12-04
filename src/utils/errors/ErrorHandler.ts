import { Request, Response, NextFunction } from 'express';
import TypeHttp from '../../framework/http.type';

class ErrorHandler {
  static middleware(
    error: Error & { statusCode?: number; public?: string }, 
    req: TypeHttp["Request"], 
    res: TypeHttp["Response"], 
    next: TypeHttp["Next"]
  ) {
    console.warn("ERROR HANDLING CALLED");
    const statusCode = error.statusCode || 500;
    
    console.error(
      JSON.stringify(error.message), 
      error.stack
    );

    res.status(statusCode).json({ 
      error: "Something went wrong!",
      message: error.public || error.message,
    });

    next(error);
  }
}

export default ErrorHandler

