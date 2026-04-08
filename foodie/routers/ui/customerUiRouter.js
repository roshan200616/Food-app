import express from "express";


const router = express.Router()
router.get("/login", async (req, res) => {
    try {
        res.render("pages/customer/login.ejs")
    }
    catch (err) {
        console.log(err.message)
    }
})
router.get('/home', async (req, res) => {
    try {
        if (req.session.IsLogged && req.session.user?.role === "customer") {

            const id = req.session.user.id
            const page = 'home'
            // const cusResponse = await fetch(`http://localhost:3000/api/customer/${id}`)

            const response = await fetch("http://localhost:3000/api/menu")
            if (response.status === 200){
                const data = await response.json()
                const cusData = req.session.user?.data
                console.log(cusData)
                res.render('pages/customer/customerHome.ejs', { data,cusData, page })

            }
            else {
                res.render('pages/customer/customerHome.ejs', { data: {}, cusData :{},page })

            }
        }
        else {
            res.render("pages/customer/login.ejs")

        }
    }
    catch (err) {
        console.log(err)
    }


})
router.get("/cart", async (req, res) => {
    try {
        const page = "cart"
        res.render('pages/customer/cart.ejs', { page })
    }
    catch (err) {
        console.log(err)
    }
})
router.get('/register', (req, res) => {
    try {
        const page = "register"
        res.render('pages/customer/register.ejs')
    }
    catch (err) {
        console.log(err)

    }
})

export default router