import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";


const userSchema = new mongoose.Schema({
 firstName:{
    type: String,
    required: [true , "First Name is required"],
 },
 lastName:{
    type: String,
    required: [true, "Last Name is required"],

 },
 email:{
    type: String,
    required: [true,"Email is required"],
    unique: true,
    validator: validator.isEmail
 },
 password: {
    type: String,
    required: [true,"Password is required"],
    minlength: [6,"Password must be at least"],
    select : true,
 },
 accountType: {type: String, default:"seeker"},
 contact: {type : String},
 loaction:{type: String},
 profileUrl: {type: String},
 jobTitle: {type:String},
 about: {type: String},
},
{timestamps: true}
);

userSchema.pre("save", async function(){
    if(!this.isModified) return;

    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt);

});

//compare password 
userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password);
    
    return isMatch;
}
//JWT TOKEN 

userSchema.methods.createJWT = async function (){
    return JWT.sign(
        {
            userId: this.id
        },
        process.env.JWT_SECRET_KEY,{
            expiresIn: "7d",
        }
    );
}
const Users = mongoose.model('Users', userSchema);

export default Users;
