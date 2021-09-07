const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

const port = 3000;
const fileName = "products.json";
const filePath = path.join(__dirname, fileName);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  getAllProducts((err, data) => {
    res.render("index", { products: data });
  });
});

app.post("/:id", (req, res) => {
  const id = req.params.id;

  getAllProducts((err, data) => {
    if (err) return console.error(err);
    const updatedProduct = orderProductById(id, data);
    res.send(updatedProduct);
  });
});

app.listen(port, () =>
  console.log(`Server started. Listening to port ${port}`)
);

function getAllProducts(callback = () => {}) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    const allProducts = JSON.parse(data);
    callback(null, allProducts);
  });
}

function orderProductById(id, allProducts) {
  console.log("orderProductById");
  const product = allProducts.find((product) => product.id === id);
  product.orders_counter++;

  const updatedProducts = JSON.stringify(allProducts, null, 2);
  fs.writeFile(filePath, updatedProducts, (err) => {
    if (err) console.error(err);
  });
  return product;
}
