const fs = require("fs");
const path = require("path");

const fileName = "products.json";
const filePath = path.join(__dirname, fileName);

let products;
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  products = JSON.parse(data);
  console.log(products);
});
