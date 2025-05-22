const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post('/', async (req, res) => {
  const { amount, userId } = req.body;

  const productId = 'book_' + Date.now(); // unique identifier for this payment

  // Prepare data as per eSewa v2 API documentation
  const payload = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: productId,
    product_code: productId,
    merchant_code: process.env.ESEWA_MERCHANT_CODE,
    success_url: `${process.env.ESEWA_SUCCESS_URL}?pid=${productId}&uid=${userId}`,
    failure_url: process.env.ESEWA_FAILURE_URL
  };

  try {
    // Step 1: Request a token from eSewa v2 API
    const response = await axios.post(
      'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      payload,
      {
        headers: {
          Authorization: `Token ${process.env.ESEWA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Step 2: Extract token and send redirect URL
    const { token } = response.data;
    const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form?token=${token}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error('Esewa Payment Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Esewa token generation failed' });
  }
});

module.exports = router;
