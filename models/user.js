import mongoose from "mongoose"
const userSchema =  new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
     },
     lastName:{
        type:String,
        required:true,
        trim:true
     },
     mobile:{
        type:String,
        required:true,
        trim:true
     },
     email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
     },
     password:{
        type:String,
        required:true,
        trim:true
     },
     role:{
        type:Number,
        enum:[1,2,3],
        default:1           //1.Users,2.admin,3.businessOwner
     },
     status:{
        type:Number,
        enum:[0,1,2],
        default:1        //0:delete,1:active,2:inactive
     }
},
{timestamps:true,versionKey:false}
)
export default mongoose.model("user",userSchema)