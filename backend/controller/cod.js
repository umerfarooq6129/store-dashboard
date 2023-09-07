const express = require('express');
const router = express.Router();
const CashOnDelivery = require('../model/codmodel');

// Cash on Delivery (COD) route
router.post('/cod', async (req, res) => {
  const { status, paymentMethod } = req.body;
   console.log(status, paymentMethod);
  try {
    const codPayment = new CashOnDelivery({
      status: status,
      paymentMethod: status,
    });
    await codPayment.save();
    res.status(200).json({
      success: true,
      message: 'Cash on Delivery payment received successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;