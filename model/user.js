const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: Number,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["voter","admin"],
        default: "voter"
    },
    isVoted:{
        type: String,
        default: false
    }
});

userSchema.pre("save", async function (next){
    const person = this;

    // Hash the password only if it has been modified (or is new).
    if(!person.isModified("password")) return next();
    try {
        // Hash password generation 
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //Over ride the plain password with the hashed one
        person.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        //Use bcrypt to compare the provided password with the hashed password
        const ismatch = await bcrypt.compare(candidatePassword, this.password);
        return ismatch;
    } catch (error) {
        throw error;
    }
}




const User = mongoose.model("User", userSchema);
module.exports = {
    User,
}