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

/*router.get("/addtocart/:productid", isloggedin, async function (req, res) {
  try {
    // Find the user by email
    let user = await userModel.findOne({ email: req.user.email });

    // Find the product by ID
    let product = await productModel.findById(req.params.productid);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/shop");
    }

    // Create a product object to store in the cart
    const productData = {
      id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
      quantity: 1, // Assuming you want to start with 1 quantity
    };

    // Check if the product is already in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.id.toString() === productData.id.toString()
    );
    if (existingProductIndex !== -1) {
      // If the product is already in the cart, increase the quantity
      user.cart[existingProductIndex].quantity += 1;
    } else {
      // If it's a new product, push the productData to the cart
      user.cart.push(productData);
    }

    // Save the user
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (error) {
    console.error("Error adding to cart:", error);
    req.flash("error", "There was an error adding the product to your cart");
    res.redirect("/shop");
  }
});*/

router.post("/cart/delete/:productid", async (req, res) => {
  try {
    const itemId = req.params.id;
    console.log(itemId);
    req.user.cart = req.user.cart.filter((item) => item.id !== itemId); // Remove item by ID
    await req.user.save(); // Save updated cart
    res.redirect("/cart");
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).send("Server error");
  }
});
router.get("/cart", isloggedin, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  let bill;
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
router.get("/blog/delete/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    await blogModel.findByIdAndDelete(blogId);
    res.redirect("/blog?success=Blog deleted successfully");
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.redirect("/blog?error=Failed to delete blog");
  }
});
router.get("/product/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await productModel.findByIdAndDelete(productId);
    res.redirect("/shop?success=Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.redirect("/shop?error=Failed to delete product");
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
