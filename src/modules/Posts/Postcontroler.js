
import Usermodel from './../../../db/models/user.model.js';
import Postmodel from './../../../db/models/post.model.js';
import StatusCodes from'http-status-codes';
 
export const createPost = async(req,res,next)=>{

    const{userId,description,postimag} = req.body

    const User=await Usermodel.findById({_id: userId})

    const newPost = new Postmodel({
        userId,
        firstName: User.firstName,
        lastName: User.lastName,
        location: User.location,
        userprofilephoto: User.profilephoto,
        comments: [],
        likes: {},
        description,
        postimag
    });

    await newPost.save();

    const Post = await Postmodel.find({ "createdAt": -1 })

    res.status(StatusCodes.CREATED).json(newPost)
}

export const getfoodposts = async(req,res,next)=>{
    const{ id } = req.params
    const{ userId } = req.body

    const User = await Usermodel.findById(id)

    const posts = await Postmodel.find({userId:id}).sort({"createdAt":-1})

    let post = await Postmodel.find({}).sort({"createdAt":-1})

    post = post.filter(item=>{
     return User.friends.includes(item,userId)
    });

    post=[...posts,...post]

    res.status(StatusCodes.OK).json(post)
};

export const getUserPosts = async(req,res)=>{
    const{ userId } = req.params 

    const post = await Postmodel.find({userId})

    res.status(StatusCodes.OK).json(post)
}

export const likepost = async(req,res)=>{

    const{ id } = req.params
    const{ userId } = req.body

    const post = await Postmodel.findById(id)
    let Islike = post.likes.get(String(userId))

    if(Islike){
        post.likes.delete(String(userId))
    }else{
        post.likes.set(String(userId),true)
    }
    const updatalike = await Postmodel.findOneAndUpdate(
        {id},
        {likes:post.likes},
        {new:true}
    )

    res.status(StatusCodes.OK).json(updatalike)
}


export const commentOnPost = async(req,res)=>{

    const{ id } = req.params 
    const{name, image, comment, userId} = req.body 

    let obj = {name, image, comment, userId}

    const post = await Postmodel.findById(id)

    post.comments.push(obj)

    const updatepost = await Postmodel.findByIdAndUpdate( 
        id,{comments: post.comments},{new: true}
    )

    res.status(StatusCodes.OK).json(updatepost)
}

export const deletecomment = async(req,res)=>{
    const { id,index } = req.params;
     

    const post = await Postmodel.findById(id);
    if(!post){res.json("post not found")}
    const comments = post.comments;

    const updatedComments = comments.filter((val, idx) => idx != index);

    const updatedPost = await Postmodel.findByIdAndUpdate(id,
        { comments: updatedComments },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json(updatedPost);
}


export const DeletePost = async(req,res)=>{
    const{ id } = req.params 

    const post = await Postmodel.findByIdAndDelete(id)

    res.status(StatusCodes.OK).json(post)

}

export const hidelikes = async(req,res)=>{

    const{ id } = req.params 

    const{ update } = req.body 

    const post = await Postmodel.findById({_id:id})

    if(!post){return res.status(StatusCodes.NOT_FOUND).json( "post dose not found")}

    if(update === "like") post.showlikes = !post.showlikes
    if(update === "comment") post.showcomments = !post.showcomments

    const newpost = await Postmodel.findOneAndUpdate( 
        {_id:id},{...post},{new:true}
    )
    
    res.status(StatusCodes.OK).json(newpost)

}