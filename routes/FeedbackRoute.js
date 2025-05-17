const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - Submit feedback
router.post('/postf', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


router.get('/getf', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
