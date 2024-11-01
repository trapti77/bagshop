const express = require("express");
const router = express.Router();
const contactModel = require("../models/contact.models.js");
router.post("/create", async function (req, res) {
  console.log(req.body);
  try {
    const { name, email, phone, message } = req.body;

    // Validate fields are not empty
    if (!name || !email || !phone || !message) {
      req.flash("error", "All fields are required");
      return res.redirect("/createcontact");
    }

    const newContact = new contactModel({ name, email, phone, message });
    await newContact.save();
    req.flash("success", "Contact created successfully");
    res.redirect("/createcontact");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/createcontact");
  }
});
router.get("/createcontacts", function (req, res) {
  let success = req.flash("success");
  res.render("createcontact", { success });
});
module.exports = router;
