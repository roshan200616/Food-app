import express from "express"

// import session 
import session from "express-session"
//import api routers
import restaurantsApi from "./routers/api/restaurantsApiRouter.js"
import menuApi from "./routers/api/menuApiRouter.js"
import customerApi from "./routers/api/customerApiRouter.js"
//import ui routers 

import restaurantsUi from "./routers/ui/restaurantsUiRouter.js"
import costomerUi from "./routers/ui/customerUiRouter.js"
import menuUi from "./routers/ui/menuUiRouter.js"

const app = express()


// set the ejs
app.set("view engine", "ejs")
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "mykey",
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = []
    }
    next()
})
//api router
app.use("/api/restaurants/", restaurantsApi)
app.use("/api/menu/", menuApi)
app.use("/api/customer/", customerApi)
//ui router
app.use("/restaurants/", restaurantsUi)
app.use("/restaurants/menu/", menuUi)
app.use("/customer/", costomerUi)

app.get("/foodie", async (req, res) => {
    try {
        res.render("pages/main/home.ejs")
    }
    catch (err) {
        console.log(err.message)
    }
})
app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("server running on http://localhost:3000")
    }

})