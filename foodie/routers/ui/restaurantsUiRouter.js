import express from "express"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        res.render("pages/restaurant/restaurantHome.ejs")
    }
    catch (err) {
        console.log(err.message)
    }
})
router.get("/menu",async(req,res)=>{
    try{
        const page = "menu"
        res.render('pages/restaurant/restaurantMenu.ejs',{page})
    }
    catch(err){
        console.log(err.message)
    }
})
router.get("/menu/add",async(req,res)=>{
    try{
        const page = 'add'
        res.render('pages/restaurant/menuAdd.ejs',{page})
    }
    catch(err){
        console.log(err.message)
    }
})
router.get("/dashborad",(req,res)=>{
     try{
         const page='dashborad'
          res.render("pages/restaurant/restaurantDashborad.ejs",{page})
    }
    catch(err){
         console.log(err.message)
    }
})
router.get("/register",(req,res)=>{
    try{
          res.render("pages/restaurant/restaurantRegister.ejs")
    }
    catch(err){
         console.log(err.message)
    }
})

router.get("/login",(req,res)=>{
    try{
         res.render("pages/restaurant/restaurantLogin.ejs")

    }
    catch(err){
        console.log(err.message)
    }
})


export default router