const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const productModel = require("./models/product");
const userModel = require("./models/user");
const orderModel = require("./models/order");
const connectMongo = require("connect-mongo");
const methodOverride = require("method-override");
const restify = require("express-restify-mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const dotenv = require("dotenv");

if (NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
mongoose.connect(process.env.DB_URL);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

restify.serve(app, productModel);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    username,
    password,
    done
  ) {
    userModel.findOne({ email: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, match) => {
        if (match) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
      // if (user.password !== password) return done(null, false);
      // return done(null, user);
    });
  })
);

app.use(
  expressSession({
    secret: "secretPhrase",
    resave: false,
    saveUninitialized: true,
    store: new connectMongo({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  debugger;
  try {
    const products = await getAllProducts();
    return res.render("index", { products });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
});

app.get("/signin", (req, res) => {
  return res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    const user = new userModel({
      email,
      password: hash,
    });
    user.save().catch((e) => console.error(e));
  });
  return res.send({ signin: true });
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/auth", checkAuthentication, (req, res) => {
  return res.send({ authenticated: true });
});

app.post("/:id", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const id = req.params.id;
  const user = req.user;
  orderProductById(id, (err, data) => {
    if (err) return res.status(500).send(err.toString());

    addOrder(data, user);
    res.send(data);
  });
});

app.get("/orders", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "no user" });
  }

  const user = req.user;
  getOrders(user._id, (err, orders) => {
    if (err) return console.error(err);
    return res.status(200).send(orders);
  });
});

app.get("/products", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "no user" });
  }
  const user = req.user;
  debugger;
  const orders = await getOrders(user._id, (err, orders) => {
    if (err) return console.error(err);

    const products = orders.map((order) => order.product.name);
    return res.status(200).send(products);
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () =>
  console.log(`Server started. Listening to port ${port}`)
);

function checkAuthentication(req, res, next) {
  // wrap passport.authenticate call in a middleware function
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info || "no user" });

    req.logIn(user, function (err) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  })(req, res, next);
}

async function getAllProducts() {
  const products = await axios.get(`${process.env.SITE_URL}/api/v1/Product`);
  return products.data;
}

function orderProductById(id, callback) {
  const filter = { id: id };
  const update = { $inc: { orders_counter: 1 } };
  const options = { new: true }; // sinon ne renvoie pas le document mis à jour
  productModel.findOneAndUpdate(filter, update, options, callback);
}

function addOrder(product, user) {
  const order = new orderModel({
    product: product._id,
    user: user._id,
    date: Date.now(),
    EUR_price: product.EUR_price,
  });
  order.save((err, data) => {
    if (err) return console.error(err);
    console.log(`${product.name} order saved in database`);
  });
}

async function getOrders(userId, callback) {
  const orders = await orderModel
    .find({ user: userId })
    .populate("product")
    .exec(callback);
  return orders;
}
