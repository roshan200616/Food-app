import express from "express";


const router = express.Router()

router.get('/home', async (req, res) => {
    try {
        const page = 'home'
        const response = await fetch("http://localhost:3000/api/menu")
        if (response.status === 200) {
            const data = await response.json()
            res.render('pages/customer/customerHome.ejs',{data,page})

        }
        else{
            res.render('pages/customer/customerHome.ejs',{data:{},page})

        }
    }
    catch (err) {
        console.log(err)
    }
})
router.get("/cart",async(req,res)=>{
    try{
         const page = "cart"
            res.render('pages/customer/cart.ejs',{page})
    }
    catch(err){
        console.log(err)
    }
})

export default router