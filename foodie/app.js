import express from "express"

// import session 
import session from "express-session"
//import api routers
import restaurantsApi from "./routers/api/restaurantsApiRouter.js"
import menuApi from "./routers/api/menuApiRouter.js"
//import ui routers 

import restaurantsUi from "./routers/ui/restaurantsUiRouter.js"
import costomerUi from "./routers/ui/customerUiRouter.js"

const app = express()


// set the ejs
app.set("view engine","ejs")
app.use(express.static('public'))
 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
   secret : "mykey",
   saveUninitialized :true,
   resave : true,
   cookie:{
      maxAge: 30*60*1000
   }
}))
//api router
app.use("/api/restaurants/",restaurantsApi)
app.use("/api/menu/",menuApi)
//ui router
app.use("/restaurants/",restaurantsUi)

app.use("/customer/",costomerUi)

app.get("/foodie", async (req, res) => {
    try {
        res.render("pages/main/home.ejs")
    }
    catch (err) {
        console.log(err.message)
    }
})
app.listen(3000,(err)=>{
    if(err){
        console.log(err)
    }
    else{
   console.log("server running on http://localhost:3000")
    }

})