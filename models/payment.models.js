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
    cardNumber: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // assuming you have a Product model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  billingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  currency: {
    type: String,
    default: "INR", // default to Indian Rupee, can change based on needs
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userNotes: {
    type: String,
    default: "",
  },
});

// Middleware to update the `updatedAt` field on each save
paymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
