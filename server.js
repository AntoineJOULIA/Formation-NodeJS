const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const port = 3000;
const productsFileName = "products.json";
const productsFilePath = path.join(__dirname, productsFileName);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  fs.readFile(productsFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    const allProducts = JSON.parse(data);
    res.render("index", { products: allProducts });
  });
});

app.listen(port, () =>
  console.log(`Server started. Listening to port ${port}`)
);
