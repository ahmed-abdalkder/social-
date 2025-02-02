
import Router from "express";
import * as PC from "./Postcontroler.js";


const router=Router()

router.post("/",PC.createPost)

router.get("/:id",PC.getfoodposts)

router.get("/getposts/:userId",PC.getUserPosts)

router.patch("/like/:id",PC.likepost)

router.patch("/comment/:id",PC.commentOnPost)

router.patch("/:id/:index",PC.deletecomment)

router.delete("/:id",PC.DeletePost)

router.patch("/:id/hide",PC.hidelikes)


export default router