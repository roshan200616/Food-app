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
router.get("/food/",async(req,res)=>{
    try{
    
        const name = req.query.name
        const result = await queryExec(`select food_name from calories where food_name like '%${name}%' limit 5`
)           
        if(result.length === 0){
            res.status(404).json("no result")
            return
        }
        else{
            res.status(200).json(result)
            return
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.get("/calories", async (req, res) => {
    try {
        const data = await queryExec(`select food_name from calories`)
        const food_names = data.map((Element) =>
            Element.food_name
        )
        res.status(200).json(food_names)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await queryExec(`select * from food_items where restaurant_id = ?`, [id])
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
router.get("/food/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await queryExec(`select * from food_items where menu_id =?`, [id])
        if (result.length === 0) {
            return res.status(404).json('Not found')
        }
        else {
            result[0].meal_type = result[0].meal_type.split(",")
            return res.status(200).json(result[0])
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.post("/", async (req, res) => {
    try {
        let { food_name, preparing_time, meal_type, price, category, sugar, carbs, protein, fat, food_calories } = req.body
        if (!req.session.IsLogged || !req.session?.user?.restaurant_id) {
            return res.status(401).json("Unauthorized")
        }
        meal_type = Array.isArray(meal_type) ? meal_type.join(",") : meal_type
        console.log(meal_type)

        const restaurant_id = req.session.user.restaurant_id
        if (
            food_name === null ||
            preparing_time === null ||
            meal_type === null ||
            price === null ||
            category === null
        ) {
            return res.status(400).json("All fields are required")
        }

        const response = await queryExec(`select calories, sugar, fat, protein, carbohydrate 
from calories where food_name = ?`, [food_name])
        if (response.length === 0) {
            food_calories = (carbs * 4) + (protein * 4) + (fat * 9)
            const result = await queryExec(
                `INSERT INTO calories(food_name, total_calories, sugar, fat, protein, carbohydrates)
 VALUES (?, ?, ?, ?, ?, ?)`,
                [food_name, food_calories, sugar, fat, protein, carbs]
            )

        }
        else {
            food_calories = response[0].calories
            sugar = response[0].sugar
            fat = response[0].fat
            protein = response[0].protein
            carbs = response[0].carbohydrate
         }
        const result = await queryExec(`insert into food_items(food_name, preparing_time, restaurant_id,meal_type, price, category,sugar,total_calories,carbs, protein,fat)
                values(?,?,?,?,?,?,?,?,?,?,?)`,
            [food_name, preparing_time, restaurant_id, meal_type, price, category, sugar, food_calories, carbs, protein, fat])
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
router.put("/:id", async (req, res) => {
    try {
        const food_id = req.params.id
        const data = req.body
        console.log(data)
        data.meal_type = Array.isArray(data.meal_type)
            ? data.meal_type.join(',')
            : data.meal_type;
        const values = Object.values(data)
        const keys = Object.keys(data)
        const set = keys.map(key => `${key}=?`).join(',')
        const result = await queryExec(`update food_items set ${set} where menu_id = ?`, [...values, food_id])
        if (result.affectedRows === 0) {
            return res.status(404).json("Not found")
        }
        else {
            return res.status(200).json("updated successfully")
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.delete("/:id", async (req, res) => {
    try {
        const food_name_id = req.params.id
        const result = await queryExec(`delete from food_items where menu_id = ?`, [food_name_id])
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Not found" })
        }
        else {
            return res.status(200).json("success")
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
export default router