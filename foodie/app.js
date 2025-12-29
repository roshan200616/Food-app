import express from "express"
//import api routers
import restaurantsApi from "./routers/api/restaurantsApiRouter.js"

//import ui routers 

import restaurantsUi from "./routers/ui/restaurantsUiRouter.js"
const app = express()
// set the ejs
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//api router
app.use("/api/restaurants/",restaurantsApi)
//ui router
app.use("/restaurants/",restaurantsUi)
app.listen(3000,()=>{
   console.log("server running on http://localhost:3000")

})