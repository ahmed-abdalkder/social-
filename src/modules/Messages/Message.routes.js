
import { Router } from "express";
import * as MC from './Message.controler.js';

const router=Router()

router.post("/",MC.postMessage)

router.get("/",MC.getmessage)

export default router