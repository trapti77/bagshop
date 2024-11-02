const mongoose = require("mongoose");
/*const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    minlength: 3,
  },
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  orders: {
    type: Array,
    ref: "Product",
  },
  contact: Number,
  image: Buffer,
});

module.exports = mongoose.model("User", userSchema);*/

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  orders: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  contact: {
    type: Number,
    required: true,
  },
  image: Buffer,
  totalSpent: {
    type: Number,
    default: 0,
  },
  lastPurchaseDate: Date,
});

module.exports = mongoose.model("User", userSchema);
