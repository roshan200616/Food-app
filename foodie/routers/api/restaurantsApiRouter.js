import express from "express";
//impoert the  DB connection file

import queryExec from "../../DBconnection.js"
const router = express.Router()

router.get('/',async (req,res)=>{
   try{
    const result = await queryExec(`select * from restaurants`)
    if(result.length === 0){
        return res.status(404).json({message : "not found" })
    }
    else{
        return res.status(200).json({result})
    }
   }
   catch(err){
        console.log(err.message)
        res.send(err.message)
   }
})
router.post('/',async(req,res)=>{
   try{
    const data= req.body;
    console.log(data)
   }
})
export default router