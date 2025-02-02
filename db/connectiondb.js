
import mongoose from "mongoose";

const connectionDB =async()=>{ 
return await mongoose.connect(process.env.database_key)

.then(()=>{
    console.log("connection DataBase successfully");
    
}).catch((err)=>{
    console.log({msg:"error",err});
    
})
}
export default connectionDB