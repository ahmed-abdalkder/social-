
import Messagemodel from "../../../db/models/message.model.js"
import StatusCodes from "http-status-codes"

export const postMessage = async(req,res)=>{

  const  {Message, sender, reciever } = req.body

    const newMessage = new Messagemodel({
        Message,sender,reciever
    });

 const sevemessage = await newMessage.save()

  res.status(StatusCodes.CREATED).json(sevemessage);

}

export const getmessage = async(req,res)=>{

    const{sender,reciever}=req.body 

    const sendmessage = await Messagemodel.find({
        sender:sender,
        reciever:reciever,
        
    }).sort({updatedAt:1})
    const recievmessage = await Messagemodel.find({
        sender:reciever,
        reciever:sender,
        
    }).sort({updatedAt:1})

    const messages = [...sendmessage,...recievmessage]
 
    messages .sort((a,b)=>a.updatedAt-b.updatedAt)
    
    const allmessages = messages.map((msg)=>{
        return{
            myself:msg.sender===sender,
            message:msg.Message
        }
    })
    res.status(StatusCodes.OK).json(allmessages)
}