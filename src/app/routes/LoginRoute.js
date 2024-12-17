import { Router } from "express";

const router = new Router()

router.get('/',(req,res)=>{
    res.send("ola mundo: login")
})

export default router