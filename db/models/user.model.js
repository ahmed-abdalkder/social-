import mongoose, { Types } from "mongoose";

const Userschema= new mongoose.Schema({

    firstName:{
        type:String,
        requird:true, 
        min:3,
        max:20
    },
    lastName:{
        type:String,
        requird:true, 
        min:3,
        max:20
    },
    email:{
        type:String,
        requird:true, 
         unique:true
    },
    password:{
        type:String,
        requird:true, 
    },
    profilephoto:{
        type:String,
        requird:true, 
        
    },
    friends:[{
         type: Types.ObjectId,
          ref: 'User' 
        }],
         
    confirmed:{
      type:Boolean,
      default:false
    },
    linkedinUrl: {
        type: String,
        default: ""
    },
    twitterUrl: {
        type: String,
        default: ""
    },
    code:String,

    occupation:String,

    location:String,

    vieweprofile:Number,

    impressions:Number,
    
    otp:Number

},{timestamps:true,
    versionKey:false
})
const Usermodel=mongoose.model("User",Userschema)
export default Usermodel