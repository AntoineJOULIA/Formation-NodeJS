const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productModel = require("./models/product");
const userModel = require("./models/user");

const app = express();
mongoose.connect("mongodb://localhost:27017/test");

const port = 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  getAllProducts((err, data) => {
    if (err) res.status(500).send(err.toString());

    res.render("index", { products: data });
  });
});

app.post(
  "/:id",
  (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const auth = email && password;
    if (auth) {
      userModel.findOne({ email, password }, (err, data) => {
        if (err) return res.status(500).send(err.toString());
        if (!data) return res.status(401).send("Wrong email or password");

        next();
      });
    } else {
      res.status(401).send("Missing credential");
    }
  },
  (req, res) => {
    const id = req.params.id;
    orderProductById(id, (err, data) => {
      if (err) res.status(500).send(err.toString());

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
