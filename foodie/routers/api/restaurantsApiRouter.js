import express from "express";
//impoert the  DB connection file

import queryExec from "../../DBconnection.js"
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const result = await queryExec(`select 
            restaurant_id,
            name,
            email,
            phone,
            address,
            owner_name,
            cuisine_type,
            is_open
             from restaurants`)
        if (result.length === 0) {
            return res.status(404).json({ message: "Not found" })
        }
        else {
            console.log(result)
            return res.status(200).json(result)

        }
    }
    catch (err) {
        console.log(err.message)
        res.send(err.message)
    }
})
router.get('/profile',async(req,res)=>{
    try{
        if(req.session.IsLogged){
            return res.status(200).json(req.session.user)
        }
        else{
            return res.status(401).json('Please login first ')
        }
    }
     catch(err){
        console.log(err)
        return res.status(500).json(err.message)
     }
})
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await queryExec(`select 
            restaurant_id,
            name,
            email,
            phone,
            address,
            owner_name,
            cuisine_type,
            is_open
             from restaurants where restaurant_id = ? `, [id])
        if (result.length === 0) {
            res.status(404).json({ message: 'Not found the restaurant ' })
        }
        else {
            res.status(200).json(result[0])
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err.message)
    }

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await queryExec(`select 
            restaurant_id,
            name,
            email,
            phone,
            address,
            owner_name,
            cuisine_type,
            is_open,
            password
             from restaurants where email = ? `, [email])
        if (result.length === 0) {
            return res.status(404).json('Invalid user')
        }
        else {
            const orginalPassword = result[0].password
            if (orginalPassword === password) {
                req.session.IsLogged = true
                const {password, ...safeuser } = result[0]
                req.session.user = safeuser
                return res.status(200).json("User Logged")
            }
            else {
                req.session.IsLogged = false
                req.session.user = {}
                console.log("invalid password")
                return res.status(401).json("Invalid password")
            }
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.post('/', async (req, res) => {
    try {
        const { name, owner_name, email, phone, address, cuisine_type, password } = req.body;
        if (!name || !owner_name || !email || !phone || !address || !cuisine_type || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const values = [name, email, phone, address, owner_name, cuisine_type, password]
        const result = await queryExec(`insert into 
        restaurants(name,email,phone,address,owner_name,cuisine_type,password)
        values(?,?,?,?,?,?,?)`, values)
        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Bad request"
            })
        }
        else {
            return res.status(201).json({ message: "Restaurant register successfully " })
        }
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
})
router.put('/check',async(req,res)=>{
   try{
     const {is_open} = req.body
     const id = req.session.user.restaurant_id
     let result 
     if(is_open === 'open'){
      result = await queryExec(`update restaurants set is_open = ? where restaurant_id =?`,
        [1,id]
     )}
     else{
            result = await queryExec(`update restaurants set is_open = ? where restaurant_id =?`,
        [0,id])
     }
    
     if(result.affectedRows === 0){
        return res.status(404).json('Not found the restaurant')
     }
     else{
        return res.status(200).json('updated successfully')
     }
   }
    catch(err){
        console.log(err)
        return res.status(500).json(err.message)
    }
})
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const keys = Object.keys(data)
        const values = Object.values(data)
        const set = keys.map(key => `${key}=?`).join(',')
        const result = await queryExec(`update  restaurants set ${set} where restaurant_id = ? `, [...values, id])
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'not found the restaurant' })
        }
        else {
            return res.status(200).json({ message: 'Updated successfully' })
        }
    }
    catch (err) {
        console.log(err)
       return res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await queryExec(`delete from restaurants where restaurant_id = ?`, [id])
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Not found restaurant' })
        }
        else {
            return res.status(200).json({ message: 'Deleted successfully' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
})

export default router