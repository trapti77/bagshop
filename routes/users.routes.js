const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/auth.controller.js");
const userModel = require("../models/user.model.js");

router.get("/", function (req, res) {
  res.send("hey");
});
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login if not authenticated
};

// Route to delete user account and cart
router.post("/delete-account/:id", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID

    // Delete the user account
    await userModel.findByIdAndDelete(userId);

    req.flash("success", "Your account has been deleted successfully.");
    res.redirect("/"); // Redirect to homepage or a confirmation page
  } catch (error) {
    console.error("Error deleting user account:", error);
    req.flash("error", "An error occurred while deleting your account.");
    res.redirect("/account"); // Redirect back to account management page
  }
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

module.exports = router;
