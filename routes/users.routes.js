const express = require("express");
const upload = require("../config/multer.config.js");
const isloggedin = require("../middlewares/isloggedin.middleware.js");
const paymentModel = require("../models/payment.models.js");

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

// Route to delete user account and cart
router.post("/delete-account/:id", isloggedin, async (req, res) => {
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
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/account", isloggedin, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id) // Use the logged-in user's ID
      .populate("orders.productId"); // Populate product details for each order

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Calculate any additional data you might want to display, like total orders
    const totalOrders = user.orders.length;

    res.render("account", { user, totalOrders }); // Pass user and additional data to the view
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/orders", isloggedin, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("orders.productId");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const totalOrders = user.orders.length; // Calculate the total number of orders
    res.render("orders", { user, orders: user.orders, totalOrders }); // Pass totalOrders to the view
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/user/orders", async (req, res) => {
  try {
    const user = req.user; // Assuming req.user is set by authentication middleware

    if (!user) {
      return res.redirect("/login"); // Redirect if user is not logged in
    }

    // Fetch the user's orders/payments
    const payments = await Payment.find({ userId: user._id })
      .sort({ date: -1 })
      .lean();

    // Use req.flash or some other method to retrieve any success messages
    const success = req.flash("success") || []; // Ensure success is defined as an array

    // Render the orders page, passing the payments and success message
    res.render("orders", { user, payments: payments || [], success });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders. Please try again.");
  }
});

module.exports = router;
