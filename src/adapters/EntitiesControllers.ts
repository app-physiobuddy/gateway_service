import TypeHttp from "../framework/http.type"
import assertRole from "./helpers/assertRole.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import axios from "axios"
import logger from "./helpers/Logger.js";
import { Physiotherapist } from "../aplication/entities";
import matchUserParamPayload from "./helpers/matchUserParamPayload.js";

const entitiesServiceURL = process.env.ENTITIES_SERVICE_URL
const authServiceURL = process.env.AUTH_SERVICE_URL
const coordinatorAServiceURL = process.env.COORDINATOR_A_SERVICE_URL

class EntitiesController<Req extends TypeHttp["Request"], Res extends TypeHttp["Response"]>{
    constructor() {
    }
    async createComapany(req:Req, res:Res) {
        //@ts-ignore
        const user = req.payload
        /*
        id
        name
        role
        email
        iat
        exp
        */
        console.log("auth id", user.id)
        assertRole(user.role).isTherapistAdminOrCompany()

        let gateway = `${entitiesServiceURL}/companies`

        req.body.user = user
        
        try {
          const response = await axios.post(gateway, req.body)
          res.status(response.status).send(response.data)
          
        } catch (error:any) {
          console.log(error)
          res.status(error.response.status).send(error.response.data);
        }  finally {
            logger.route(gateway, user.id)
        } 
    }
    async addTherapist(req:Req, res:Res) {
        //@ts-ignore
        const user = req.payload // decodes token for comapny user.id
        assertRole(user.role).isTherapistAdminOrCompany() //edge case for therapistAdmin not implemented

        const user_id = Number(req.params.user_id)
        matchUserParamPayload(user_id, Number(user.id))

        if (!req.body.therapistEmail) throw ErrorTypes.NotFoundError("therapistEmail is required");
        const therapistEmail = req.body.therapistEmail

        req.body.data = {
            user_id_company: user_id,
            therapistEmail:therapistEmail,
            ...req.body.data
        }

        let gateway = `${coordinatorAServiceURL}/coordinator-a/add-therapist`
        console.log(gateway, req.body.data)
        try {
          const response = await axios.post(gateway, req.body)
          res.status(response.status).send(response.data)
          logger.route(gateway, user.id)
        } catch (error:any) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }


    }
    async getTherapistByUserId(req:Req, res:Res) {
        // Route for therapist only
        //@ts-ignore
        const user = req.payload // decodes token for therapist user.id
        const user_id = Number(req.params.user_id)
        console.log(user)
        assertRole(user.role).isTherapist()
        // if the user is a therapist, the param id must be equal to the user.id from token
        matchUserParamPayload(user_id, Number(user.id))


        let gateway = `${entitiesServiceURL}/therapists/${user_id}` 
        try {
          const response = await axios.get(gateway)
          res.status(response.status).send(response.data)
          logger.route(gateway, user.id)
          
        } catch (error:any) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }
        
    }
    async therapistAddsPatient(req:Req, res:Res) {
        //@ts-ignore
        const user = req.payload // decodes token for therapist user.id
        console.log("therapistAddsPatient CALLED")
        assertRole(user.role).isTherapist()

        const user_id = Number(req.params.user_id)
        matchUserParamPayload(user_id, Number(user.id))


        if (!req.body.patientEmail) throw ErrorTypes.UnauthorizedAccess("therapistEmail is required");

       
        req.body.data = {
          user_id_therapist: user.id,
          ...req.body.data
      }
        let gateway = `${coordinatorAServiceURL}/coordinator-a/add-patient`
        console.log(gateway, req.body.data)
        try {
          const response = await axios.post(gateway, req.body)
          res.status(response.status).send(response.data)
          logger.route(gateway, user.id)
        } catch (error:any) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }


    }
    async getAllPatientsByTherapistId(req:Req, res:Res) {
        //@ts-ignore
        const user = req.payload // decodes token for therapist user.id
        assertRole(user.role).isTherapist()
        const user_id = Number(req.params.user_id)
        matchUserParamPayload(user_id, Number(user.id))

        let gateway = `${entitiesServiceURL}/therapists/${user.id}/patients` //user.id is auth therapist id

        try {
          const response = await axios.get(gateway)
          res.status(response.status).send(response.data)
          logger.route(gateway, user.id)
          
        } catch (error:any) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }
    }

    async therapistGetsPatientByPatientId(req:Req, res:Res) {
        //@ts-ignore
        const user = req.payload // decodes token for therapist user.id
        assertRole(user.role).isTherapist()
        const user_id = Number(req.params.user_id)
        matchUserParamPayload(user_id, Number(user.id))
        const patient_id = Number(req.params.patient_id)

        let gateway = `${entitiesServiceURL}/therapists/${user.id}/patients/${patient_id}` //user.id is auth therapist id, patiend_id is the patients' profile id

        try {
          const response = await axios.get(gateway)
          res.status(response.status).send(response.data)
          logger.route(gateway, user.id)
          
        } catch (error:any) {
          //console.log(error)
          res.status(error.response.status).send(error.response.data);
        }
    }
    //patientGetsPatientsByUserId
    async patientGetsPatientsByUserId(req:Req, res:Res) {
      //@ts-ignore
      const user = req.payload // decodes token for therapist user.id
      assertRole(user.role).isPatient()
      const user_id = Number(req.params.user_id)
      matchUserParamPayload(user_id, Number(user.id))


      let gateway = `${entitiesServiceURL}/patients/${user.id}` 

      try {
        const response = await axios.get(gateway)
        res.status(response.status).send(response.data)
        logger.route(gateway, user.id)
        
      } catch (error:any) {
        //console.log(error)
        res.status(error.response.status).send(error.response.data);
      }
  }
}

export default EntitiesController