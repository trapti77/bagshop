const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config.js");
const blogModel = require("../models/blog.models.js");
router.post("/create", upload.single("image"), async function (req, res) {
  try {
    let { title, content } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const buffer = req.file.buffer; // Get the buffer from the uploaded file
    let blog = await blogModel.create({
      image: buffer,
      title,
      content,
    });
    req.flash("success", "blog created successfully.");
    res.redirect("/owners/admin");
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
