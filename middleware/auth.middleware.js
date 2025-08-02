const { verifyToken } = require("../services/authentication");

function authenticationOfUserToken(cookieName) {
    return (req,res,next) => {
        try {
            const token = req.cookies[cookieName];
            if(!token) return next();

            const userPayload = verifyToken(token);
            req.user = userPayload;

        } catch (error) {}
        return next();

    }
}
 

module.exports = { authenticationOfUserToken };