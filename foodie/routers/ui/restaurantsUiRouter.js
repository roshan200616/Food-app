import express from "express"

const router = express.Router()

router.get("/menu",async(req,res)=>{
    try{
        const page = "menu"
        res.render('pages/restaurant/restaurantMenu.ejs',{page})
    }
    catch(err){
        console.log(err.message)
    }
})
router.get("/profile",(req,res)=>{
    try{
        const page = 'profile'
        res.render('pages/restaurant/restaurantProfile.ejs',{page})
    }
    catch(err){
        console,log(err.message)
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
router.get("/dashboard",(req,res)=>{
     try{
        if(req.session.IsLogged){
         const page='dashboard'
          res.render("pages/restaurant/restaurantDashboard.ejs",{page})
        }
        else{
         res.redirect("http://localhost:3000/restaurants/login")
        }
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
router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            res.status(500).json("error logout")
        }
        else{
         res.redirect(302,"http://localhost:3000/restaurants/login")
        }
    })
})


export default router