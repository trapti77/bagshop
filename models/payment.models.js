const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  cardDetails: {
    cardNumber: String,
    cardName: String,
    expiryDate: String,
    cvv: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("Payment", paymentSchema);
