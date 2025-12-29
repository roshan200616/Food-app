import express from "express"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const page = "dashboard"
        res.render("pages/restaurantHome.ejs",{page})
    }
    catch (err) {
        console.log(err.message)
    }
})
router.get("/menu",async(req,res)=>{
    try{
        const page = "menu"
        res.render('pages/restaurantMenu.ejs',{page})
    }
    catch(err){
        console.log(err.message)
    }
})
router.get("/menu/add",async(req,res)=>{
    try{
        const page = 'add'
        res.render('pages/menuAdd.ejs',{page})
    }
    catch(err){
        console.log(err.message)
    }
})
export default router