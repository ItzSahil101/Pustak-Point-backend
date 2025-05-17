const express = require('express');
const { User } = require('../models/userModel');
const router = express.Router();

router.post("/", async (req, res) => {
    const { bookId, id } = req.body;
  
    try {
      const user = await User.findById(id);
  
      if (!user) return res.status(404).send("User not found");
  
      if (user.books.includes(bookId)) {
        return res.status(400).send("Book already purchased");
      }
  
      if (user.points < 10) {
        return res.status(400).send("Insufficient points");
      }
  
      user.points -= 10;
      user.books.push(bookId);
  
      await user.save();
  
      res.status(200).send({ message: "Purchased, Preview your book in profile page", points: user.points });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");
      res.status(200).json(user.books); // Array of bookIds
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  

module.exports = router;
