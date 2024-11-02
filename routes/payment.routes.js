const express = require("express");
const router = express.Router();
const paymentModel = require("../models/payment.models.js");
const isloggedin = require("../middlewares/isloggedin.middleware.js");
router.post("/create", isloggedin, async (req, res) => {
  const user = req.user; // Assuming user information is available in the request

  // Check if the user is authenticated and has a cart
  if (!user || !user.cart || user.cart.length === 0) {
    return res.redirect("/shop"); // Redirect to the shop if the cart is empty
  }

  // Calculate total amount from cart items
  const totalAmount = user.cart.reduce(
    (acc, item) => acc + (item.price - item.discount) * item.quantity,
    0
  );

  // Extract payment details from the form
  const { cardNumber, expiryDate, cvv, cardName } = req.body;

  // Validate payment details
  if (!cardNumber || !expiryDate || !cvv || !cardName) {
    return res
      .status(400)
      .send("Payment details are incomplete. Please try again.");
  }

  // Simulate payment processing logic (replace this with actual payment gateway logic)
  const isPaymentSuccessful = true; // Simulate a successful payment

  if (isPaymentSuccessful) {
    // Create a new payment record
    const payment = new paymentModel({
      userId: user._id,
      amount: totalAmount,
      status: "completed", // Set the payment status to completed
      cardDetails: {
        cardNumber,
        cardName,
        expiryDate,
        cvv,
      },
      items: user.cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
    await payment.save();

    // Clear the user's cart after successful payment
    user.cart = []; // Clear the cart
    await user.save(); // Save the updated user data
    res.render("payment", { totalAmount });
    res.redirect("/success"); // Redirect to a success page
  } else {
    // Handle payment failure
    res.status(500).send("Payment failed. Please try again.");
  }
});
router.get("/payment", async (req, res) => {
  const user = req.user; // Get the currently logged-in user

  // Check if the user and cart exist
  if (!user || !user.cart || user.cart.length === 0) {
    return res.redirect("/shop"); // Redirect to the shop if the cart is empty
  }

  // Calculate total amount from cart items
  const totalAmount = user.cart.reduce(
    (acc, item) => acc + (item.price - item.discount) * item.quantity,
    0
  );

  // Render the payment page with total amount
  res.render("payment", { totalAmount }); // Ensure totalAmount is passed here
});

router.get("/success", (req, res) => {
  res.render("success"); // Render a success page
});
module.exports = router;
