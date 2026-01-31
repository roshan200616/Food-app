import express from "express"
const router = express.Router()
router.get("/", async (req, res) => {
    try {
        if (req.session.IsLogged || req.session?.user) {
            const page = "menu"
            const id = req.session.user.restaurant_id
            const response = await fetch(`http://localhost:3000/api/menu/${id}`)
            if (response.status === 200) {
                const data = await response.json()
                res.render('pages/restaurant/restaurantMenu.ejs', { page, data })
            }
            else {

                res.render('pages/restaurant/restaurantMenu.ejs', { page, data: [] })
            }
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")

        }
    }
    catch (err) {
        console.log(err.message)
    }
})
router.get("/add", async (req, res) => {
    try {
        if (req.session.IsLogged) {
            const page = 'add'
            const response = await fetch(`http://localhost:3000/api/menu/calories`)
            if (response.status === 200) {
                const data = await response.json()
                return res.render('pages/restaurant/menuAdd.ejs', { page, data })
            }
            else {
                return res.render('pages/restaurant/menuAdd.ejs', { page, data: {} })
            }
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")

        }
    }

    catch (err) {
        console.log(err.message)
    }

})
router.get("/edit/:id", async (req, res) => {
    try {
        if (req.session.IsLogged) {
            const id = req.params.id
            const page = 'edit'
            const response = await fetch(`http://localhost:3000/api/menu/food/${id}`)
            if (response.status === 200) {
                const data = await response.json()
                console.log(data)
                return res.render('pages/restaurant/menuAdd.ejs', { page,data })
            }
            else {
                return res.render('pages/restaurant/menuAdd.ejs', { page, data: [] })
            }
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")

        }
    }
    catch (err) {
        console.log(err.message)
    }
})
export default router