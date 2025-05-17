const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();

// Forgot Password route
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWTPRIVATEKEY, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const resetLink = `${process.env.BASE_URL}reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle actual password reset
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid token or user does not exist" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
