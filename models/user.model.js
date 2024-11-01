const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
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
  picture: String,
});

module.exports = mongoose.model("User", userSchema);
