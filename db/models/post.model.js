
import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    likes:{
        type:Map,
        of:Boolean
    },
    comments:{
        type:Array,
        
    },
    showlikes:{
        type:Boolean,
        default:true
    },   
    showcomments:{
        type:Boolean,
        default:true 
    },
     location:String,
      description:String,
        postimag:String,
        userprofilephoto:String,
},{
    timestamps:true,
    versionKey:false
})
const Postmodel= mongoose.model("Post",PostSchema)
export default Postmodel