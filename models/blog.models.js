const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  { image: Buffer, email: String, title: String, content: String },

  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Export the model
module.exports = mongoose.model("Blog", blogSchema);
