const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const { jwtAuthMiddleware, generateToken} = require("../jwt");

//Post router to add a person
router.post("/singup", async(req,res)=>{
    try {
        const data = req.body;

        const user = new User(data);
        //Save the newUser to the database.
        const response = await user.save();
        console.log("Data save sucessfully!");

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ",token);

        res.status(200).json({response: response, token: token})

    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({error: "Internal server Error."})
    }
})
//Login Route.
router.post("/login",async(req,res)=>{
    try {
        //Extract aadharCardNumber or password from request body.
        const { aadharCardNumber, password } = req.body;

        //Find the user by aadharCardNumber in database.
        const user = await user.findOne({aadharCardNumber: aadharCardNumber});

        //if user does not exist or password does not match, return error.
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password !"});
        }

        //Generate Token
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        //return token as response,
        res.json({token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server Error."})
    }
});
//Profile route.
router.get("/profile", jwtAuthMiddleware, async (req,res) =>{
    try {
        //To excract the user data.
        const User = req.user;
        //Exctact userID.
        const userId = User.id;
        const user = await User.findById(userId);
        res.status(200).json({user});

    } catch (error) {
        console.log(err);
        res.status(500).json({error: "Internal server Error."})
    }
});

//To change the password.
router.put("/profile/password", jwtAuthMiddleware, async(req,res)=>{
    try {
        const userId = req.user; //Extract the id from the token.
        //Extract current and new password from the request body.
        const { currentPassword, newPassword } = req.body; 

        //Find the user by userID.
        const user = await User.findById({userId});

        //If password doesn't match, return error.
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: "Invaild username or password!"})
        }

        //update the user's password.
        user.password = newPassword;
        await user.save();

        console.log("password updated!");
        res.status(200).json({message: "password updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server Error"});
    }
})



module.exports = router;
