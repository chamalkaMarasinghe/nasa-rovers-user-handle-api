const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user");

const verifyAuthority = (req, res, next) => {
    try {
        const token = req.header("AccessToken");
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    return res.status(401).json({
                        status: "Fail", 
                        message: "Unathorized!" 
                    });
                } else {
                    const user = await UserSchema.findById(data.id);
                    if (user) {
                        next();
                    } else {
                        return res.status(401).json({
                            status: "Fail", 
                            message: "Unathorized!" 
                        });
                    }
                }
            });
        } else {
            return res.status(401).json({
                status: "Fail", 
                message: "Unathorized!" 
            });
        }
    } catch (error) {
        return res.status(401).json({
            status: "Fail", 
            message: "Unathorized!" 
        });
    }
};

module.exports = verifyAuthority;
