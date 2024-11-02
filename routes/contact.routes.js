const express = require("express");
const router = express.Router();
const contactModel = require("../models/contact.models.js");

// Route for displaying the contact form
router.get("/contact", (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("contact", { success, error });
});

// Route for handling contact form submission
router.post("/create", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new contactModel({ name, email, phone, message });
    await newContact.save();
    req.flash("success", "Message submitted successfully.");
    res.redirect("/owners/admin");
  } catch (err) {
    req.flash("error", "Failed to submit the message.");
    res.redirect("/contact");
  }
});

// Route for displaying contacts in the admin page
router.get("/admin/contact", async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.render("admin", { contacts });
  } catch (err) {
    res.status(500).send("Error loading contact messages.");
  }
});

module.exports = router;
