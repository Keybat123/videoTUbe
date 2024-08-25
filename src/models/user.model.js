import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        index: true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },  
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
    }, 
    avatar:{
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true,"Password is required."]
    },
    refreshToken:  {
        type: String,
    }

},{timestamps: true})

userSchema.pre("save",async function(next){ //don't use arrow function here it need instance of the methods but arrow function not use this keyword for instance
    if(!this.isModified("password")) next()
    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return JWT.sign(
    {
        _id : this._id,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){
    return JWT.sign(
    {
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)