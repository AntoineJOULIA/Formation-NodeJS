const express = require("express");
const productModel = require("../models/product");

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  getAllProducts((err, data) => {
    if (err) res.status(500).send(err.toString());

    res.render("index", {
      products: data,
    });
  });
});

router.post("/:id", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const id = req.params.id;
  const user = req.user;
  getProductById(id, (err, data) => {
    if (err) return res.status(500).send(err.toString());

    // addOrder(data, user);
    res.send(data);
  });
});

function getAllProducts(callback) {
  productModel.find({}, callback);
}

function getProductById(id, callback) {
  const filter = { id: id };
  const update = { $inc: { orders_counter: 1 } };
  const options = { new: true }; // sinon ne renvoie pas le document mis à jour
  productModel.findOneAndUpdate(filter, update, options, callback);
}

module.exports = router;
