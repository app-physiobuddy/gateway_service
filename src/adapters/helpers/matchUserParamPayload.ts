import ErrorTypes from "../../utils/errors/ErrorTypes.js"

export default function matchUserParamPayload(userParam:number, userPayload:number) {
    const truth =  userParam === userPayload
    if (!truth) throw ErrorTypes.UnauthorizedAccess("Acess denied. Invalid User");
}