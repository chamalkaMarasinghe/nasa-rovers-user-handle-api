const userSchema = require("../models/user");
const jwt = require('jsonwebtoken');

const registerUsers = async(req, res) => {
    try {
        const { userInfo } = req.body;

        //if the user name is already in use terminate the workflow 
        const user = await userSchema.findOne({user_name: userInfo.user_name});
        if(user !== null){
            console.log("already used user name");
            res.status(400);
            res.json({
                status: 'Fail',
                message: 'already used user name!'
            });
            return;
        }

        const createdUser = await userSchema.create(userInfo);
        if(createdUser !== null){
            res.status(201);
            res.json({
                status: 'Success',
                message: 'user created!',
                user: createdUser
            });
            return;
        }else{
            console.log("error occured during create the user");
            res.status(500);
            res.json({
                status: 'Fail',
                message: 'error occured!'
            });
            return;
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500);
        res.json({
            status: 'Fail',
            message: 'server error occured!',
            error: error
        });
        return;
    }
    //sample request body
    /*
    **
    {
        "userInfo" : {
            "user_name": "chamal",
            "first_name": "Chamalka",
            "last_name": "Marasinghe",
            "contact_no": "0755721324",
            "email": "chamal@gmail.com",
            "password": "adminchamal",
        }
    }
    **
    */
}

const signIn = async(req, res) => {
    try {
        const { userCredentials } = req.body;
        const user = await userSchema.findOne({user_name : userCredentials.user_name});
        if(user !== null){
            if(user.password.localeCompare(userCredentials.password) == 0){

                const id = user._id;
                const token = jwt.sign({id}, process.env.TOKEN_KEY);
                user["password"] = null;
                
                res.status(202);
                res.json({
                    status : "Success",
                    message: "Signed-in Successfully",
                    user : user, 
                    token : token, 
                    id: user._id,
                    role: "Admin",
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profilePicture: user.base64ProfileImg,
                    isDarkMode: true,
                    isDefaultPassword: false

                });
                return;
            }
            else{
                res.status(401);
                res.json({ 
                    status: 'Fail',
                    message: 'invalid passowrd!',
                });
                return;
            }
        }
        else{
            res.status(401);
            res.json({ 
                status: 'Fail',
                message: 'invalid username!',
            });
            return;
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500);
        res.json({
            status: 'Fail',
            message: 'server error occured!',
            error: error
        });
        return;
    }

    //sample request body
    /*
    **
    {
        "userCredentials" : {
            "user_name": "chamal",
            "password": "adminchamal"
        }
    }
    **
    */
}

module.exports = {
    registerUsers,
    signIn
}