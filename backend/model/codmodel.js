const mongoose = require("mongoose");
const cashSchema = new mongoose.Schema({
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  });
  
  module.exports = mongoose.model("CashOnDelivery", cashSchema);