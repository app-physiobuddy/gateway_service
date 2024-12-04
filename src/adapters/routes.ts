import { Router, Request, Response, NextFunction, Errback } from "express";

export const router = Router();



const asyncHandler = (controller:any) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  }
router.get("/", asyncHandler((req: Request, res: Response) => 
    res.send("API Gateway is running;")
));

//AUTH

router.post('/register', asyncHandler((req:Request, res:Response) => 
    authController.register(req, res)
));

router.post('/login', asyncHandler((req:Request, res:Response) => 
    authController.login(req, res)
));

router.get('/user/all', asyncHandler((req:Request, res:Response) => 
    authController.getAll(req, res)
));

router.post('/user/changePassword', asyncHandler((req:Request, res:Response) => 
    authController.changePassword(req, res)
));

router.get('/user/details', asyncHandler((req:Request, res:Response) => 
    authController.getAll(req, res)
));

