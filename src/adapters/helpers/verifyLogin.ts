import TypeHttp from "../../framework/http.type";
import ErrorTypes from "../../utils/errors/ErrorTypes.js";
import AuthProvider from "../../framework/providers/AuthProvider.js";
const authProvider = new AuthProvider(process.env.PASETO_PUBLIC_KEY!);

const verifyLogin = async (req: TypeHttp["Request"], res: TypeHttp["Response"], next: TypeHttp["Next"]) => {
    const token = req.headers["token"] as string;
    if (!token) throw ErrorTypes.UnauthorizedAccess('Acess denied, missing token');
    
    try {
        const payload = await authProvider.decodeToken(token);
        console.log(payload)
        if (!payload) throw ErrorTypes.UnauthorizedAccess('Acess denied');
        //@ts-ignore
        req.payload = payload
        next()
    } catch (error:any) {
        console.log(error)
        throw ErrorTypes.UnauthorizedAccess('Acess denied');

    }

};

export default verifyLogin