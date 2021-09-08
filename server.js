const fs = require("fs");
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

const app = express();
mongoose.connect("mongodb://localhost:27017/test");

const port = 3000;

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser(function (user, done) {
  console.log("serialize");
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  console.log("deserialize");
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
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

app.use(
  expressSession({
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  getAllProducts((err, data) => {
    if (err) res.status(500).send(err.toString());

    res.render("index", {
      products: data,
    });
  });
});

app.post(
  "/:id",
  // wrap passport.authenticate call in a middleware function
  function (req, res, next) {
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate("local", function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      // console.log(error);
      // console.log(user);
      // console.log(info);

      if (error) {
        return res.status(401).send(error);
      } else if (!user) {
        return res.status(401).send(info);
      } else {
        next();
      }
    })(req, res);
  },

  // function to call once successfully authenticated
  function (req, res) {
    const id = req.params.id;
    orderProductById(id, (err, data) => {
      if (err) return res.status(500).send(err.toString());

      res.send(data);
    });
  }
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () =>
  console.log(`Server started. Listening to port ${port}`)
);

function getAllProducts(callback = () => {}) {
  productModel.find({}, callback);
}

function orderProductById(id, callback) {
  const filter = { id: id };
  const update = { $inc: { orders_counter: 1 } };
  const options = { new: true }; // sinon ne renvoie pas le document mis à jour
  productModel.findOneAndUpdate(filter, update, options, callback);
}
