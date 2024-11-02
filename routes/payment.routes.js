const express = require("express");
const router = express.Router();
const paymentModel = require("../models/payment.models.js");
const isloggedin = require("../middlewares/isloggedin.middleware.js");
router.post("/payment", isloggedin, async (req, res) => {
  const user = req.user; // Assuming user information is available in req.user

  if (!user) {
    return res.status(401).send("User not authenticated.");
  }

  // Extract payment details from the form
  const { cardName, cardNumber, expiryDate, cvv } = req.body;

  // Check if the user and cart exist and have items
  if (!user.cart || user.cart.length === 0) {
    return res.redirect("/shop"); // Redirect to the shop if the cart is empty
  }

  // Calculate total amount from cart items
  const totalAmount = user.cart.reduce(
    (acc, item) => acc + (item.price - item.discount) * item.quantity,
    0
  );

  // Simple payment validation for demonstration
  if (!cardName || !cardNumber || !expiryDate || !cvv) {
    return res
      .status(400)
      .send("Payment details are incomplete. Please try again.");
  }

  // Simulate payment processing logic
  const isPaymentSuccessful = true; // Replace with actual payment gateway logic

  if (isPaymentSuccessful) {
    // Create payment record in the database
    const paymentData = {
      userId: user._id,
      amount: totalAmount,
      status: "completed",
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
    };

    const payment = new paymentModel(paymentData);

    try {
      await payment.save();
      // Clear the user's cart after successful payment
      user.cart = []; // Clear the cart array
      await user.save();

      res.redirect("/success"); // Redirect to success page
    } catch (error) {
      console.error("Error saving payment:", error);
      res.status(500).send("Error processing payment. Please try again.");
    }
  } else {
    // Handle payment failure
    res.status(500).send("Payment failed. Please try again.");
  }
});

// Route to view payment page
router.get("/payment", async (req, res) => {
  const user = req.user; // Assuming user information is available in req.user

  if (!user || !user.cart || user.cart.length === 0) {
    return res.redirect("/shop"); // Redirect to shop if the cart is empty
  }

  // Calculate total amount from cart items
  const totalAmount = user.cart.reduce(
    (acc, item) => acc + (item.price - item.discount) * item.quantity,
    0
  );

  // Render payment page with total amount
  res.render("payment", { totalAmount }); // Pass totalAmount to the payment view
});

router.get("/success", (req, res) => {
  res.render("success"); // Render a success page
});
module.exports = router;
