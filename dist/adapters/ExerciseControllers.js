import assertRole from "./helpers/assertRole.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import axios from "axios";
import logger from "./helpers/Logger.js";
import matchUserParamPayload from "./helpers/matchUserParamPayload.js";
const entitiesServiceURL = process.env.ENTITIES_SERVICE_URL;
const authServiceURL = process.env.AUTH_SERVICE_URL;
const exerciseServiceURL = process.env.EXERCISE_SERVICE_URL;
const cordinatorAServiceURL = process.env.COORDINATOR_A_SERVICE_URL;
const cordinatorBServiceURL = process.env.COORDINATOR_B_SERVICE_URL;
class ExerciseController {
    constructor() {
    }
    async createCategory(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist user.id
        assertRole(user.role).isTherapist();
        const user_id = Number(req.params.user_id);
        matchUserParamPayload(user_id, Number(user.id));
        const company_id = Number(req.params.company_id);
        if (!req.body.data)
            throw ErrorTypes.ValidationError("category data is required");
        req.body.data = {
            company_id: company_id,
            therapist_user_id: user_id,
            ...req.body.data
        };
        const gateway = `${cordinatorBServiceURL}/coordinator-b/make-category`;
        console.log(gateway, req.body.data);
        try {
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
            logger.route(gateway, user.id);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async therapistGetsAllCategories(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist user.id
        assertRole(user.role).isTherapist();
        const user_id = Number(req.params.user_id);
        matchUserParamPayload(user_id, Number(user.id));
        const company_id = Number(req.params.company_id);
        const gateway = `${cordinatorBServiceURL}/coordinator-b/therapists/${user_id}/company/${company_id}/categories`;
        try {
            const response = await axios.get(gateway);
            res.status(response.status).send(response.data);
            logger.route(gateway, user.id);
        }
        catch (error) {
            //console.log(error)
            res.status(error.response.status).send(error.response.data);
        }
    }
    async createExercise(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist user.id
        assertRole(user.role).isTherapist();
        const user_id = Number(req.params.user_id);
        matchUserParamPayload(user_id, Number(user.id));
        const company_id = Number(req.params.company_id);
        if (!req.body.data)
            throw ErrorTypes.ValidationError("exercise data is required");
        req.body.data = {
            company_id: company_id,
            therapist_user_id: user_id,
            ...req.body.data
        };
        const gateway = `${cordinatorBServiceURL}/coordinator-b/make-exercise`;
        console.log(gateway, req.body.data);
        try {
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
            logger.route(gateway, user.id);
        }
        catch (error) {
            //console.log(error)
            res.status(error.response.status).send(error.response.data);
        }
    }
    async therapistGetsAllExercises(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist/patient user.id
        assertRole(user.role).isTherapist();
        const user_id = Number(req.params.user_id);
        console.log(user_id, user.id);
        matchUserParamPayload(user_id, Number(user.id));
        console.log("therapistGetsAllExercises");
        const company_id = Number(req.params.company_id);
        const gateway = `${cordinatorBServiceURL}/coordinator-b/therapists/${user_id}/company/${company_id}/exercises`;
        try {
            const response = await axios.get(gateway);
            res.status(response.status).send(response.data);
            logger.route(gateway, user.id);
        }
        catch (error) {
            //console.log(error)
            res.status(error.response.status).send(error.response.data);
        }
    }
    async createPlan(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist user.id
        assertRole(user.role).isTherapist();
        if (!req.params["user_id"])
            throw ErrorTypes.UnauthorizedAccess("user.id is required");
        const user_id = Number(req.params.user_id);
        matchUserParamPayload(user_id, Number(user.id));
        if (!req.params["patient_id"])
            throw ErrorTypes.UnauthorizedAccess("patient.id is required");
        const patient_id = Number(req.params.patient_id);
        console.log("GATEWAY", patient_id);
        if (!req.body.data)
            throw ErrorTypes.ValidationError("exercise data is required");
        req.body.data = {
            patient_id: patient_id, //id_pac on entity exercise
            therapist_user_id: user_id, //id_physio on entity exercise
            ...req.body.data
        };
        const gateway = `${cordinatorBServiceURL}/coordinator-b/make-plan`;
        console.log(gateway, req.body.data);
        try {
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
            logger.route(gateway, user.id);
        }
        catch (error) {
            //console.log(error)
            res.status(error.response.status).send(error.response.data);
        }
    }
    async getPlanByIdAndPatientId(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist/patient user.id
        if (user.role === "company")
            throw ErrorTypes.ServerError("Company sees plans edge case, not implemented");
        assertRole(user.role).isPatientOrTherapist();
        const user_id = Number(user.id);
        if (!req.params.patient_id)
            throw ErrorTypes.UnauthorizedAccess("patient_id is required");
        const patient_id = Number(req.params.patient_id);
        if (!req.params.plan_id)
            throw ErrorTypes.UnauthorizedAccess("plan_id is required");
        const plan_id = Number(req.params.plan_id);
        if (user.role === "patient") {
            //verifica se user.id is on pacient_id profile
            const gateway = `${cordinatorBServiceURL}/coordinator-b/patient-user/${user.id}/patient/${patient_id}/plans/${plan_id}`;
            try {
                const response = await axios.get(gateway);
                logger.route(gateway, user.id);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                //console.log(error)
                res.status(error.response.status).send(error.response.data);
            }
        }
        if (user.role === "therapist") {
            //manda para coordenador B -> entidade verificar se é paciente
            const gateway = `${cordinatorBServiceURL}/coordinator-b/therapists/${user.id}/patient/${patient_id}/plans/${plan_id}`;
            try {
                const response = await axios.get(gateway);
                logger.route(gateway, user.id);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                //console.log(error)
                res.status(error.response.status).send(error.response.data);
            }
        }
    }
    async getPlansByPatientId(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for therapist user.id
        if (user.role === "company")
            throw ErrorTypes.ServerError("Company sees plans edge case, not implemented");
        assertRole(user.role).isPatientOrTherapist();
        if (!req.params.patient_id)
            throw ErrorTypes.UnauthorizedAccess("patient.id is required");
        const patient_id = Number(req.params.patient_id);
        console.log("getPlansByPatientId", patient_id, user.id);
        if (user.role === "patient") {
            //verifica se user.id is on pacient_id profile
            const gateway = `${cordinatorBServiceURL}/coordinator-b/patient-user/${user.id}/patient/${patient_id}/plans`;
            try {
                const response = await axios.get(gateway);
                logger.route(gateway, user.id);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                //console.log(error)
                res.status(error.response.status).send(error.response.data);
            }
        }
        if (user.role === "therapist") {
            //manda para coordenador B -> entidade verificar se é paciente
            const gateway = `${cordinatorBServiceURL}/coordinator-b/therapists/${user.id}/patient/${patient_id}/plans`;
            try {
                const response = await axios.get(gateway);
                logger.route(gateway, user.id);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                //console.log(error)
                res.status(error.response.status).send(error.response.data);
            }
        }
    }
    async onPlanMarkDayAsDone(req, res) {
        //@ts-ignore
        const user = req.payload; // decodes token for patient user.id
        assertRole(user.role).isPatient();
        const user_id = Number(user.id);
        if (!req.params.patient_id)
            throw ErrorTypes.UnauthorizedAccess("patient_id is required");
        const patient_id = Number(req.params.patient_id);
        if (!req.params.plan_id)
            throw ErrorTypes.UnauthorizedAccess("plan_id is required");
        const plan_id = Number(req.params.plan_id);
        if (!req.params.exercise_id)
            throw ErrorTypes.UnauthorizedAccess("exercise_id is required");
        const exercise_id = Number(req.params.exercise_id);
        //verifica se user.id is on pacient_id profile
        const gateway = `${cordinatorBServiceURL}/coordinator-b/patient-user/${user.id}/patient/${patient_id}/plans/${plan_id}/exercises/${exercise_id}`;
        try {
            const response = await axios.put(gateway, req.body);
            logger.route(gateway, user.id);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            //console.log(error)
            res.status(error.response.status).send(error.response.data);
        }
    }
}
export default ExerciseController;
