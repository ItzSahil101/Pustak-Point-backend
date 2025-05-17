const express = require('express');
const crypto = require('crypto'); // For generating the hash
const router = express.Router();
const {User} = require('../models/userModel'); // Assuming you have a User model

// Route to verify eSewa payment
router.post('/verify-payment', async (req, res) => {
    const { txnid, amt, pid, scd, status, hash, uid } = req.body;

    const secretKey = process.env.ESEWA_SECRET_KEY;

    const expectedHashString = txnid + amt + pid + scd + status + secretKey;
    const expectedHash = crypto.createHash('sha256').update(expectedHashString).digest('hex');

    if (status === 'Success' && hash === expectedHash) {
        try {
            const User = await User.findById(uid);

           const user = await User.findById(uid);

           if(user){
            user.points+=amt;
            await user.save();

            res.json({status: "Payment veyfied and point updated!", User})
           }else{
            res.json({status: "User not found!!"})
           }
        } catch (error) {
            console.error('Error updating User points:', error);
            res.status(500).json({ status: 'Internal server error' });
        }
    } else {
        // If payment verification failed
        res.json({ status: 'Payment verification failed.' });
    }
});

module.exports = router;
