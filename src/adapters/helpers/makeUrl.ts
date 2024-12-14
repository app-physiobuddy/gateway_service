import TypeHttp from "../../framework/http.type";
function makeUrl(req:TypeHttp["Request"]) {
    const fileUrl = `${req.protocol}://${req.get('host')}/`;
    return (pathFromRoot:string) => {
        return `${fileUrl}${pathFromRoot}`
    }
}

export default makeUrl