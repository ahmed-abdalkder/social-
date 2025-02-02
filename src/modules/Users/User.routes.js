
 
import Router from "express";
import * as UC from './User.controler.js';

const router=Router();

router.post("/",UC.register);

router.get("/verifyprofile/:token",UC.verifyprofile);

router.post("/login",UC.login);

router.put("/forget",UC.forgetpassword);

router.put("/reset",UC.resetpassword );

router.get("/user/:id",UC.getuser );

router.get("/friends/:id",UC.getuserfriends );

router.get("/formattedUser",UC.formattedUser );

router.patch("/friend",UC.addFriend );

router.get("/Suggested/:id",UC.getSuggestedUsers );

router.put("/Remove",UC.Removefriends );

router.put("/update/:id",UC.updatesocileprofile );

router.delete("/delete/:id",UC.DeleteUser );

router.put("/updates/:id",UC.UpdateUser );

export default router;