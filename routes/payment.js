const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
  const { amount, userId } = req.body;
  const totalAmount = amount;
  const productId = 'book_' + Date.now();

  const formData = {
    amt: totalAmount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: totalAmount,
    pid: productId,
    scd: process.env.ESEWA_MERCHANT_CODE, // Your Merchant Code (TEST MERCHANT CODE for sandbox)
    su: `${process.env.ESEWA_SUCCESS_URL}?pid=${productId}&uid=${userId}`, // Success URL after payment
    fu: process.env.ESEWA_FAILURE_URL, // Failure URL after payment
  };

  const queryString = new URLSearchParams(formData).toString();

  // Make sure to use the UAT URL (sandbox mode) for testing
  const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form?token=${token}`;

  res.json({ paymentUrl });
});

module.exports = router;
