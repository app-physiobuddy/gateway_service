import { Router, Request, Response, NextFunction, Errback } from "express";
import AuthController from "./AuthControllers.js";
import verifyLogin from "./helpers/verifyLogin.js";
import EntitiesController from "./EntitiesControllers.js";
import ExerciseController from "./ExerciseControllers.js";

const authController = new AuthController();
const entitiesController = new EntitiesController()
const exerciseController = new ExerciseController()

import axios from "axios";



export const router = Router();



const asyncHandler = (controller:any) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  }
router.get("/", asyncHandler((req: Request, res: Response) => 
    res.send("API Gateway is running;")
));

//AUTH

router.post('/auth/register', asyncHandler((req:Request, res:Response) => 
    authController.register(req, res)
));

router.post('/auth/login', asyncHandler((req:Request, res:Response) => 
    authController.login(req, res)
));

router.get('/auth/user/all', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    authController.getAll(req, res)
));

router.post('/auth/user/changePassword', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    authController.changePassword(req, res)
));

router.get('/auth/user/:userId',asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    authController.details(req, res)
));

router.post('/auth/user/recoverPassword/*', asyncHandler((req:Request, res:Response) => 
    authController.recoverPassword(req, res)
));

//ENTITIES SERVICE


router.post('/companies', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    entitiesController.createComapany(req, res)
));

router.post('/companies/:user_id/therapists', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    entitiesController.addTherapist(req, res)
));
router.get('/companies/:user_id/therapists', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    res.send("TODO: gets all therapists of this company;")
));
router.get('/therapists/:user_id', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    entitiesController.getTherapistByUserId(req, res)
));

/*
router.get('/companies', asyncHandler(verifyLogin), asyncHandler((req:Request, res:Response) => 
    //Admin
    entitiesController.getCompanies(req, res)
));
*/

router.post("/therapists/:user_id/patients", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    // Adds patient to that specific therapist
    // passes user_id to create new patient
    entitiesController.therapistAddsPatient(req, res)
));

router.get("/therapists/:user_id/patients", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    // gets all patitents of that therapist // alterei o endpoint
    entitiesController.getAllPatientsByTherapistId(req, res)
));

router.get("/therapists/:user_id/patients/:patient_id", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    // gets all patitents of that therapist // alterei o endpoint
    entitiesController.therapistGetsPatientByPatientId(req, res)
));

router.get("/patients/:user_id/", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    // gets all patitents profiles from that user_id patient
    entitiesController.patientGetsPatientsByUserId(req, res)
));

// EXERCISE SERVICE
// Categorias
router.post("/therapists/:user_id/companies/:company_id/categories", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    exerciseController.createCategory(req, res)
));

router.get("/therapists/:user_id/companies/:company_id/categories",asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    exerciseController.therapistGetsAllCategories(req, res)
  ));

router.get("/companies/:company_id/categories",asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    //exerciseController.getCategoriesByCompanyId(req, res)
    res.send("TODO: gets all categories of this company;")
  ));

// Exercicios
router.post("/therapists/:user_id/companies/:company_id/exercises",asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    exerciseController.createExercise(req, res)
  ));

router.get("/therapists/:user_id/companies/:company_id/exercises", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
  exerciseController.therapistGetsAllExercises(req, res)
));


//plans
router.post("/therapists/:user_id/patients/:patient_id/plans",asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    exerciseController.createPlan(req, res)
  ));

router.get("/patients/:patient_id/plans",asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    exerciseController.getPlansByPatientId(req, res)
));

router.get("/patients/:patient_id/plans/:plan_id", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
    //res.send("Obter informação de um plano especifico de um paciente.")
    exerciseController.getPlanByIdAndPatientId(req, res)
));

router.put("/patients/:patient_id/plans/:plan_id/exercises/:exercise_id/", asyncHandler(verifyLogin), asyncHandler((req: Request, res: Response) => 
//"Paciente marcar um dia (ou vários) do exercício de um plano como feito.
    exerciseController.onPlanMarkDayAsDone(req, res)
));


