const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isloggedin.middleware.js");
const productModel = require("../models/product.model.js");
const userModel = require("../models/user.model.js");
const blogModel = require("../models/blog.models.js");
const contactModel = require("../models/contact.models.js");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, isloggedin: false });
});
router.get("/shop", isloggedin, async function (req, res) {
  const products = await productModel.find();
  let success = req.flash("success");

  /* products.image = products.image.buffer.toString("base64");
  res.render("shop", { products });
});
router.get("/logout", isloggedin, function (req, res) {
  res.render("shop");*/
  const updatedProducts = products.map((product) => {
    return {
      ...product.toObject(),
      image: product.image ? product.image.toString("base64") : null, // Convert buffer to base64 string
    };
  });
  res.render("shop", { products: updatedProducts, success });
});
router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "addded to cart");
  res.redirect("/shop");
});

router.get("/cart", isloggedin, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  if (user.cart && user.cart.length > 0) {
    // Calculate the total bill
    bill = user.cart.reduce((acc, item) => {
      // Ensure item.price and item.discount are numbers
      const price = Number(item.price);
      const discount = Number(item.discount);
      return price - discount; // Add the price minus discount for each item
    }, 0);

    // Add any fixed fees (like shipping)
    bill += 20; // Add shipping or any other fee
  }

  // Render the cart view with the user and the total bill
  res.render("cart", { user, bill });
});
router.get("/blog", isloggedin, async function (req, res) {
  const blogs = await blogModel.find();
  let success = req.flash("success");
  const updatedBlogs = blogs.map((blog) => {
    return {
      ...blog.toObject(),
      image: blog.image ? blog.image.toString("base64") : null, // Convert buffer to base64 string
    };
  });
  res.render("blog", { blogs: updatedBlogs, success });
});

router.get("/contact", isloggedin, async function (req, res) {
  try {
    const contacts = await contactModel.find();
    let success = req.flash("success");

    const updatedContacts = contacts.map((contact) => contact.toObject()); // Convert each contact to plain object

    res.render("admin", { contacts: updatedContacts, success });
  } catch (err) {
    req.flash("error", "Failed to load contacts.");
    res.redirect("/error"); // Redirect to an error page or handle as preferred
  }
});

/*
  let bill = 0;
  if (user.cart && user.cart.length > 0) {
    return (bill =
      Number(user.cart[item].price + 20) - Number(user.cart[item].discount));
  }

  res.render("cart", { user, bill });

  //res.render("cart", { user, bill });
});*/

module.exports = router;
