const mongoose = require("mongoose");
const ownerSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    minlength: 3,
  },
  email: String,
  password: String,
  isadmin: Boolean,
  products: {
    type: Array,
    default: [],
  },
  picture: String,
  gstno: String,
});

module.exports = mongoose.model("Owner", ownerSchema);
