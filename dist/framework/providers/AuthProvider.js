import { V4, } from "paseto";
import ErrorTypes from "../../utils/errors/ErrorTypes.js";
export default class AuthProvider {
    constructor(publicKey) {
        this.V4 = V4;
        this.publicKey = publicKey;
    }
    async decodeToken(token) {
        try {
            const payload = await this.V4.verify(token, this.publicKey);
            return payload;
        }
        catch (error) {
            // If an error occurs, throw a custom ValidationError
            throw ErrorTypes.ValidationError({
                public: "Invalid token",
                inner: "AuthProvider Decode:Token is not valid"
            });
        }
    }
}
