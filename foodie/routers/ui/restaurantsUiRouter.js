import express from "express"

const router = express.Router()
router.get("/login", (req, res) => {
    try {
        res.render("pages/restaurant/restaurantLogin.ejs")

    }
    catch (err) {
        console.log(err.message)
    }
})
router.get("/dashboard", (req, res) => {
    try {
        if (req.session.IsLogged) {
            const page = 'dashboard'
            res.render("pages/restaurant/restaurantDashboard.ejs", { page })
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")
        }
    }
    catch (err) {
        console.log(err.message)
    }
})

router.get("/profile", async (req, res) => {
    try {
        if (req.session.IsLogged) {
            const page = 'profile'
            const id = req.session.user.restaurant_id
            const response = await fetch(`http://localhost:3000/api/restaurants/${id}`)
            if (response.status === 200) {
                const data = await response.json()

                res.render('pages/restaurant/restaurantProfile.ejs', { page, data })
            }
            else {
                res.render('pages/restaurant/restaurantProfile.ejs', { page, data: {} })

            }
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")

        }

    }
    catch (err) {
        console, log(err.message)
    }
})
router.get("/menu", async (req, res) => {
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
router.get("/menu/add", async (req, res) => {
    try {
        if (req.session.IsLogged) {
            const page = 'add'
            res.render('pages/restaurant/menuAdd.ejs', { page })
        }
        else {
            res.redirect("http://localhost:3000/restaurants/login")

        }
    }

    catch (err) {
        console.log(err.message)
    }

})
router.get("/register", (req, res) => {
    try {
        const page = 'register'
        res.render("pages/restaurant/restaurantRegister.ejs", { page, data: [] })
    }
    catch (err) {
        console.log(err.message)
    }
})
router.get("/edit", async (req, res) => {
    try {
        if (req.session.IsLogged) {
            const page = 'edit'
            const id = req.session.user.restaurant_id
            const response = await fetch(`http://localhost:3000/api/restaurants/${id}`)
            if (response.status === 200) {
                const data = await response.json()
                res.render("pages/restaurant/restaurantRegister.ejs", { data, page })

            }
            else {
                res.render("pages/restaurant/restaurantRegister.ejs", { data: [], page })

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
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json("error logout")
        }
        else {
            res.redirect(302, "http://localhost:3000/restaurants/login")
        }
    })
})



export default router