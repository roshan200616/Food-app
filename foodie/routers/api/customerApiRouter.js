import express from "express";
import queryExec from "../../DBconnection.js"
import e from "express";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const result = await queryExec(`select * from customers`)
        if (result.length === 0) {
            res.status(404).json("not found")
        }
        else {
            res.status(200).json(result)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json("server error")
    }
})
router.get("/:id",async(req,res)=>{
    try{
      const id = req.params.id
      console.log(id)
      const result = await queryExec(`select * from customers where id =?`,[id])
      console.log(result)
      if(result.length === 0){
        res.status(404).json("not found")
        return
      }

      else{
       res.status(200).json(result[0])
      }
    }
    catch(err){
        console.log(err)
        res.status(500).json("server error")
    }
})
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await queryExec(`select * from customers where email =?`, [email])
        if (result.length === 0) {
            res.status(404).json("invaild user")
        }
        else {
            const orginalPassword = result[0].password
            if (orginalPassword === password) {
                req.session.IsLogged= true
                const { password, ...safeuser } = result[0]
                req.session.user = {
                    id:safeuser.id,
                    role:"customer",
                    data:safeuser

                }
                res.status(200).json("User Logged")
                return


            }
            else{
                req.session.IsLogged = false
                req.session.user =null
                res.status(401).json("invalid password")
                return
            }
        }
        
    }
    catch(err){
        console.log(err)
        res.status(500).json("server error")
    }
})
router.post("/cart",async(req,res)=>{
    try{
        const {menu_id,food_name,price,sugar,fat,carbs,protein,total_calories} = req.body
        const cart = req.session.cart
        const existing = cart.find(item => item.id == menu_id)   

        if(existing){
          existing.qty+=1
        }
        else{
            cart.push({
            id:menu_id,
            name:food_name,
            price:price,
            sugar:sugar,
            fat:fat,
            protein:protein,
            carbs:carbs,
            calotories:total_calories,
            qty: 1
          })
        }
        const cartCount = cart.length
        res.status(200).json(cart)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err.message)
    }
})
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body
        if (!name || !email || !mobile || !password) {
            res.status(400).json("All fields are required ")
            return
        }
        const emailRex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const moblierex = /^[0-9]{10}$/
        if (!emailRex.test(email)) {
            res.status(404).json("invalid email")
            return
        }
        if (!moblierex.test(mobile)) {
            res.status(404).json("invalid phone")
        }
        const result = await queryExec(`insert into customers(name,email,mobile,password)
        values(?,?,?,?)`, [name, email, mobile, password])
        if (result.affectedRows === 0) {
            res.status(400).json("Bad request")
            return
        }
        else {
            res.status(200).json("successfully added")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json("server error")
    }
})
router.put("/:id", async (req, res) => {
    try {
        const data = req.body
        const id = req.params.id
        const keys = Object.keys(data)
        const values = Object.values(data)
        const set = keys.map(key => `${key}=?`).join(",")
        const result = await queryExec(`update customers set ${set} where id = ?`, [...values, id])
        if (result.affectedRows === 0) {
            res.status(404).json("Not found")
        }
        else {
            res.status(200).json("Updated successfully")
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json("server error")
    }
})
router.delete("/:id",async(req,res)=>{
    try{
        const id = req.params.id
        const result = await queryExec(`delete from customers where id = ?`,[id])
        if(result.affectedRows === 0){
            res.status(404).json("not found")
            return
        } 
        else{
            res.status(200).json("deleted successfully")
            return
        }
    }
    catch(err){
       console.log(err)
       res.status(500).json("server error")
    }
})
export default router