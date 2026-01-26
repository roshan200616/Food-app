// import module
import express from "express"
//mysql connection file 
import queryExec from "./../../DBconnection.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const result = await queryExec(`select * from food_items`)
        if (result.length === 0) {
            return res.status(404).json("No records")
        }
        else {
            return res.status(200).json(result)
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await queryExec(`select * from food_items where restaurant_id = ?`,[id])
        if (result.length === 0) {
            return res.status(404).json("No records")
        }
        else {
            return res.status(200).json(result)
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.post("/", async (req, res) => {
    try {
        const { food_item, prepare_timing, meal_type, price, category, sugar, carbs, protein, fat } = req.body
        if(!req.session.IsLogged || !req.session?.user?.restaurant_id){
            return res.status(401).json("Unauthorized")
        }
        const restaurant_id = req.session.user.restaurant_id
        let food_calories
        if (
            food_item == null ||
            prepare_timing == null ||
            meal_type == null ||
            price == null ||
            category == null ||
            sugar == null ||
            carbs == null ||
            protein == null ||
            fat == null
        ) {
            return res.status(400).json("All fields are required")
        }

        const response = await queryExec(`select calories from food_calories where food_name =?`, [food_item])
        if (response.length === 0) {
            food_calories = (carbs * 4) + (protein * 4) + (fat * 9)
            const result = await queryExec(`insert into food_calories(food_name,calories) values(?,?)`, [food_item, food_calories])

        }
        else {
            food_calories = response[0].calories

        }

        const result = await queryExec(`insert into food_items(food_item, prepare_timing, restaurant_id,meal_type, price, category,sugar,food_calories,carbs, protein,fat)
                values(?,?,?,?,?,?,?,?,?,?,?)`,
            [food_item, prepare_timing, restaurant_id, meal_type, price, category, sugar, food_calories, carbs, protein, fat])
        if (result.affectedRows === 0) {
            return res.status(400).json("Bad request")
        }
        else {
            return res.status(201).json("success")
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.put("/:id",async(req,res)=>{
    try{
       const food_id = req.params.id
       const data = req.body
       const values = Object.values(data)
       const keys = Object.keys(data)
       const set = keys.map(key=>`${key}=?`).join(',')
       const result = await queryExec(`update food_items set ${set} where food_id = ?`,[...values,food_id])
       if(result.affectedRows === 0){
        return res.status(404).json("Not found")
       }
       else{
        return res.status(200).json("updated successfully")
       }
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.delete("/:id",async(req,res)=>{
    try{
        const food_id = req.params.id
        const result = await queryExec(`delete from food_items where food_id = ?`,[food_id])
        if(result.affectedRows===0){
            return res.status(404).json({error:"Not found"})
        }
        else{
            return res.status(200).json("success")
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err.message)
    }
})
export default router