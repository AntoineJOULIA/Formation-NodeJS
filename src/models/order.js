const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  EUR_price: Number,
});

const orderModel = new mongoose.model("Order", orderSchema);

module.exports = orderModel;
