const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db.config.js");
const ownersRouter = require("./routes/owners.routes.js");
const usersRouter = require("./routes/users.routes.js");
const productsRouter = require("./routes/products.routes.js");
const blogRouter = require("./routes/blog.routes.js");
const indexRouter = require("./routes/index.js");
const dotenv = require("dotenv");
const expressSession = require("express-session");
const flash = require("connect-flash");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/blogs", blogRouter);
app.use("/", indexRouter);

app.listen(1600);
