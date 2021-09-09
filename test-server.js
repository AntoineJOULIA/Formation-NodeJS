const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const routes = require("./routes/products");

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/test");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
