import { Request, Response, NextFunction } from "express";

type TypeHttp = {
    Request: Request,
    Response: Response
    Next: NextFunction
}

export default TypeHttp