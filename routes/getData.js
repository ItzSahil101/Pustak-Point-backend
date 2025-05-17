const router = require("express").Router();
const { User } = require("../models/userModel");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  try{
  const token = req.body.token;

  const SECRET_KEY =  process.env.JWTPRIVATEKEY;

  if(token){
    jwt.verify(token, SECRET_KEY, async(err, decoded)=>{
      if(err){
        return res.status(400).json({ msg: 'Invalid token' });
      }

      const userDet = await User.findById(decoded._id)
      res.send(userDet)
    })
  }
  
  }catch(err){
    console.log(err)
    res.send("Something went wrong! pls refresh page")
  }
});

module.exports = router;