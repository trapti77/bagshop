const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config.js");
const productModel = require("../models/product.model.js");
router.post("/create", upload.single("image"), async function (req, res) {
  try {
    let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const buffer = req.file.buffer; // Get the buffer from the uploaded file
    let product = await productModel.create({
      image: buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    });
    req.flash("success", "product created successfully.");
    res.redirect("/owners/admin");
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
