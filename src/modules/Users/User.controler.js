import StatusCodes from'http-status-codes';
import bcrypt from'bcrypt'; 
import jwt from "jsonwebtoken";
import { customAlphabet } from 'nanoid';
import Usermodel from "../../../db/models/user.model.js"
import { SendEmail } from './../../service/sendEmail.js';
import Messagemodel from './../../../db/models/message.model.js';
import Postmodel from './../../../db/models/post.model.js';
 
 
 


export const register = async(req,res,next)=>{
   const{ email } = req.body

    const userexist = await Usermodel.findOne({ email })

    if(userexist){res.status(StatusCodes.BAD_REQUEST).json({ msg: "User Is exist." })}

    const Salt = await bcrypt.genSalt()

    const hash = bcrypt.hashSync(req.body.password,Salt)

     const token = jwt.sign({email },token_key)
     const link = `http://localhost:3000/users/verifyprofile/${token}` 
     await SendEmail(email,"check link",`<a href="${link}">click of link</a>`);

    const User = new Usermodel({
        ...req.body,
        password:hash,
        vieweprofile:Math.floor(Math.random()*1000),
        impressions:Math.floor(Math.random()*1000),
        otp:null
    })
  const newUser = await User.save()

 res.status(StatusCodes.CREATED).json(newUser) 

}

export const verifyprofile = async(req,res)=>{
    const{token} = req.params 

    const decoded = jwt.verify(token,token_key)

    if(!decoded?.email) {return res.status(StatusCodes.NOT_FOUND).json("invalid token")}
    const user = await Usermodel.findOneAndUpdate(
        {email:decoded.email,confirmed:false},{confirmed:true},{new:true}
    )

    res.status(StatusCodes.OK).json(user)
  
};
export const login=async(req,res,next)=>{

    const{email, password} = req.body

    const User = await Usermodel.findOne({email})

    if(!User){return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User does not exist." })}

    const Ismatch = bcrypt.compareSync(password,User.password)

    if(!Ismatch){return res.status(StatusCodes.BAD_REQUEST).json({ msg: "password does not exist." })}

    const token = jwt.sign({email, id: User.id}, token_key)

    delete User.password

    res.status(200).json({token,User})

}

export const  forgetpassword = async(req,res)=>{
    const{email} = req.body 
    const user = await Usermodel.findOne({email})
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json("user dose not found")
    }
    const code = customAlphabet("0123456789",5)

    const newcode = code()

    await SendEmail(email,"new code",`<h1>your code ${newcode}</h1>`)

    await Usermodel.updateOne({email},{ code:newcode})

    res.status(StatusCodes.OK).json( "done")

};

export const resetpassword = async(req,res)=>{
    const{email, password, code} = req.body 

    const user = await Usermodel.findOne({email})
    if(!user){
       return res.status(StatusCodes.NOT_FOUND).json("user dose not found")
    }
    if(user.code !== code){
       return res.status(StatusCodes.NOT_FOUND).json("invalid code ") 
    }
    const Salt = await bcrypt .genSalt()
    const hash = bcrypt.hashSync(password,Salt)

    const newpassword = await Usermodel.findOneAndUpdate(
        {email},{password: hash, code: ""},{naw: true}
    )

    res.status(StatusCodes.OK).json(newpassword)

}

export const getuser = async(req,res)=>{

    const{ id } = req.params

    const user = await Usermodel.findById(id)
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json("user dose not found")
    }

    res.status(StatusCodes.OK).json(user)
    
}

export const formattedUser = async(req,res)=>{

    const{email} = req.body

    const user = await Usermodel.findOne( {email})
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json("user dose not found")
    }
    const formatteduser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        occupation: user.occupation,
        location: user.location,
        profilephoto: user.profilephoto
    };

    res.status(StatusCodes.OK).json(formatteduser)
    
}

export const addFriend = async (req, res) => {
     
        const { userId, friendId } = req.body;

         const user = await Usermodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

         if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "Friend already added" });
        }

        user.friends.push(friendId);

        await user.save();

       
        const friend = await Usermodel.findById(friendId);

        if (friend && !friend.friends.includes(userId)) {
            friend.friends.push(userId);
            await friend.save();
        }

        res.status(200).json({ message: "Friend added successfully", user });
    
};
 
export const getuserfriends = async (req,res)=>{

const{id} = req.params

const user = await Usermodel.findById(id)

if(!user){res.status(StatusCodes.NOT_FOUND).json("user does not found")}

const friends = await Promise.all(
    user.friends.map((id)=> Usermodel.findById(id))
);
const formattedfriends = friends.map(({ _id,firstName,lastName,occupation,location,profilephoto })=>{
    return { _id,firstName,lastName,occupation,location,profilephoto }
});

res.status(StatusCodes.OK).json(formattedfriends)

};

export const getSuggestedUsers = async(req,res)=>{

    const{ id } = req.params ;

    const user = await Usermodel.findById(id);

    if(!user){return res.status(StatusCodes.NOT_FOUND).json("user dose not exist")};

  let allusers = await Usermodel.find({});

  const  SuggestedUsers = allusers.filter(item=>{
   return user.friends.includes(item._id ) === false && item._id != id
  });

  const formattedSuggested = SuggestedUsers.map((
    {_id, firstName, lastName, occupation, location, profilephoto})=>{
    return {_id,firstName,lastName,occupation,location,profilephoto}
  });

  res.status(StatusCodes.OK).json(formattedSuggested)

}

export const Removefriends = async(req,res)=>{

    const{id,friendId} = req.body 

    const user = await Usermodel.findById(id)

    const friend = await Usermodel.findById(friendId)

    if(!user||!friend){return res.status(StatusCodes.NOT_FOUND)
    .json("user dose not exist or friendes dose not exist")}

if(user.friends.includes(friendId)){
    user.friends = user.friends.filter(id=> id !== friendId)

    friend.friends = friend.friends.filter(id=> id !== id)

}else{

    user.friends.push(friendId);
    friend.friends.push(id)
}
await user.save()

await friend.save()

  const friends = await Promise.all(
     user.friends.map((id)=> Usermodel.findById(id))
  );

  const formattedfriends = friends.map(({_id,firstName,lastName,occupation,location,profilephoto})=>{
    return {_id,firstName,lastName,occupation,location,profilephoto}

  });

  res.status(StatusCodes.OK).json(formattedfriends)

};

export const updatesocileprofile = async(req,res)=>{
    const{ id } = req.params 

    const {linkedinUrl, twitterUrl} = req.body 

    const user = await Usermodel.findById(id)

    if(!user){res.status(StatusCodes.NOT_FOUND).json("user does not found")}

     user.linkedinUrl = linkedinUrl
     user.twitterUrl = twitterUrl

    const updateuser = await Usermodel.findByIdAndUpdate
    (id,{...user},{new: true}

    )

    res.status(StatusCodes.OK).json(updateuser)

}

export const DeleteUser = async(req,res)=>{

    const{ id } = req.params 

    const user = await Usermodel.findById(id)
    if(!user){res.status(StatusCodes.NOT_FOUND).json("user does not found")}

    await Messagemodel.deleteMany({sender: id,reciever: id})

    await Postmodel.deleteMany({userId:id})

    const allposts = await Postmodel.find({})

    for (const post of allposts) {

        if(post.comments){
            post.comments = post.comments.filter(obj=> obj.userId != id)
        }

        post.likes.delete(id)

        await post.save()
    }

  await Usermodel.findByIdAndDelete(id)

  const allusers = await Usermodel.find({})

  for (const user of allusers) {
    const index = user.friends.indexOf(id)

    if(index != -1)user.friends.splice(index,1)

        await user.save()
  }

  res.status(StatusCodes.OK).json(user)

}

export const UpdateUser = async(req,res)=>{

    const{ id } = req.params 
   const{ email, password, profilephoto} = req.body

   const user = await Usermodel.findOne({email: email, _id: id})
   if(!user){

   return res.status(StatusCodes.BAD_REQUEST).json("user does not found")

   }
   
    const salt = await bcrypt.genSalt()
    const hash =  bcrypt.hashSync(password,salt)
   

 const updatauser = await Usermodel.findByIdAndUpdate(id,{...req.body,password:hash},{new:true})

 if(!updatauser){
   return res.status(StatusCodes.BAD_REQUEST).json("user does not updated")
}
 const posts = await Postmodel.find({})

 posts.forEach(async(value,index)=>{

   let newcomments = []

   for (const comment of value.comments) {

    if(comment.userId === id){

        newcomments.push({comment,

            image:profilephoto}
        )
    }else newcomments.push(comment)

    value.comments = newcomments
   }
 
   let userprofilephoto = value.userprofilephoto

   if(value.userId === id)userprofilephoto = profilephoto
   const post = {

    firstName:value.firstName,

    lastName:value.lastName,
    
    userId:value.userId,
    likes:value.likes,
    comments:value.comments,
    location :value.location,
    description:value.description ,
    postimag:value.postimag ,
    userprofilephoto:value.userprofilephoto ,

   }

    await Postmodel.findByIdAndDelete({_id:value.id})

    const newpost = new Postmodel(post)

    await newpost.save()
 })
 
 const updatepost = await Postmodel.find({}).sort({"createdAt":-1})

 res.status(StatusCodes.OK).json({updatauser,updatepost })

}