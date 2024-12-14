import assertRole from "./helpers/assertRole.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import axios from "axios";
import logger from "./helpers/Logger.js";
import makeUrl from "./helpers/makeUrl.js";
const authServiceURL = process.env.AUTH_SERVICE_URL;
class AuthController {
    constructor() {
    }
    async register(req, res) {
        let gateway = `${authServiceURL}/auth/register`;
        let user_id = req.body.user ? req.body.user.id : req.body.email ? req.body.email : "undefined";
        user_id = String(user_id);
        try {
            logger.route(gateway, user_id);
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async login(req, res) {
        console.log("login route called");
        let gateway = `${authServiceURL}/auth/login`;
        let user_id = req.body.user ? req.body.user.id : req.body.email ? req.body.email : "undefined";
        user_id = String(user_id);
        try {
            logger.route(gateway, user_id);
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async getAll(req, res) {
        let gateway = `${authServiceURL}/auth/user/all`;
        //@ts-ignore
        const user = req.payload;
        assertRole(user.role).isAdmin();
        try {
            logger.route(gateway, user.email);
            const response = await axios.get(gateway);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async changePassword(req, res) {
        let gateway = `${authServiceURL}/auth/user/changePassword`;
        //@ts-ignore
        const email = req.payload.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        if (!oldPassword || !newPassword)
            throw ErrorTypes.ValidationError('Old password and new password are required');
        const info = {
            oldPassword,
            newPassword,
            email
        };
        console.log(info);
        req.body = {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        try {
            logger.route(gateway, email);
            const response = await axios.post(gateway, req.body);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async details(req, res) {
        //@ts-ignore
        const id = req.payload.id;
        let gateway = `${authServiceURL}/auth/user/${id}`;
        req.body = {
            id: id,
        };
        try {
            logger.route(gateway, id);
            const response = await axios.get(gateway, req.body);
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
        }
    }
    async recoverPassword(req, res) {
        //@ts-ignore
        const [email, recoveryToken] = req.params[0].split("+");
        if (!email || !recoveryToken) {
            let gateway = `${authServiceURL}/auth/user/recoverPassword/*`;
            try {
                const url = makeUrl(req)("auth/user/recoverPassword/");
                console.log(url);
                if (!req.body.email)
                    throw ErrorTypes.ValidationError('Email is required');
                logger.route(gateway, email);
                req.body.url = url;
                const response = await axios.post(gateway, req.body);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                console.log(error);
                res.status(error.response.status).send(error.response.data);
            }
        }
        else {
            console.log("email", email);
            console.log("recoveryToken", recoveryToken);
            try {
                let gateway = `${authServiceURL}/auth/user/recoverPassword/${email}+${recoveryToken}`;
                if (!req.body.newPassword)
                    throw ErrorTypes.ValidationError('newPassword is required');
                logger.route(gateway, email);
                const response = await axios.post(gateway, req.body);
                res.status(response.status).send(response.data);
            }
            catch (error) {
                console.log(error);
                res.status(error.response.status).send(error.response.data);
            }
        }
    }
}
export default AuthController;
