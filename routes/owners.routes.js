const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner.model.js");
const ProductModel = require("../models/product.model.js");
const BlogModel = require("../models/blog.models.js");
const ContactModel = require("../models/contact.models.js");
const paymentModel = require("../models/payment.models.js");
const upload = require("../config/multer.config.js");

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
      return res
        .status(500)
        .send("you dont have permission to create a new owner");
    }
    let { fullname, email, password } = req.body;
    let createOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    res.status(201).send(createOwner);
  });
}
router.get("/createproducts", function (req, res) {
  let success = req.flash("success");
  res.render("createproducts", { success });
});
router.get("/createblogs", function (req, res) {
  let success = req.flash("success");
  res.render("createblog", { success });
});

//console.log(process.env.NODE_ENV);

router.get("/admin", async (req, res) => {
  try {
    const success = req.query.success || ""; // or any value you want to set
    const blogs = await BlogModel.find(); // Fetch blogs
    const products = await ProductModel.find(); // Fetch products
    const contacts = await ContactModel.find();
    const orders = await paymentModel.find();

    res.render("admin", { success, blogs, products, contacts, orders });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

// Handle form submission
router.get("/admin/contacts", async (req, res) => {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    res.render("admin/contacts", { contacts });
  } catch (error) {
    res.status(500).send("Failed to retrieve messages");
  }
});
router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await paymentModel
      .find()
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.render("admin/orders", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders. Please try again.");
  }
});
module.exports = router;
