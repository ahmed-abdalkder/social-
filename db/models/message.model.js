
import  mongoose  from 'mongoose';


const MessageSchme=new mongoose.Schema({

    Message:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    reciever:{
        type:String,
        required:true
    },
},{timestamps:true,
    versionKey:false
})
const Messagemodel = mongoose.model("Message",MessageSchme)
export default Messagemodel