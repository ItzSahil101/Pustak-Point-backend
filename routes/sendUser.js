const router = require("express").Router();
const { User } = require("../models/userModel");
router.get("/", async(req, res)=>{
    try{
        const users = await User.find({}, "firstName lastName books");
        res.json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
})

module.exports = router;
