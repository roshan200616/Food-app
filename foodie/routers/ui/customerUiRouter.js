import express from "express";


const router = express.Router()

router.get('/home',async(req,res)=>{
    try{
    res.render('pages/customer/customerHome.ejs')
    }
    catch(err){
        console.log(err)
    }
})

export default router