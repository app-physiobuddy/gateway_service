import { Router } from "express";
export const router = Router();
const asyncHandler = (controller) => (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
};
router.get("/", asyncHandler((req, res) => res.send("API Gateway is running;")));
//AUTH
router.post('/register', asyncHandler((req, res) => authController.register(req, res)));
router.post('/login', asyncHandler((req, res) => authController.login(req, res)));
router.get('/user/all', asyncHandler((req, res) => authController.getAll(req, res)));
router.post('/user/changePassword', asyncHandler((req, res) => authController.changePassword(req, res)));
router.get('/user/details', asyncHandler((req, res) => authController.getAll(req, res)));
