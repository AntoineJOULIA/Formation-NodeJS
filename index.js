const fs = require("fs");
const path = require("path");
const readline = require("readline");

const fileName = "products.json";
const filePath = path.join(__dirname, fileName);

function getAllProducts(displayData = true, callback = () => {}) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    const allProducts = JSON.parse(data);

    if (displayData) {
      console.log("Bienvenue. Voici les produits disponibles:");
      allProducts.forEach((product) => {
        const { id, name, EUR_price, orders_counter } = product;
        console.log(`${id} - ${name} / ${EUR_price} / ${orders_counter}`);
      });
    }
    callback(null, allProducts);
  });
}

function orderProductById(id, allProducts) {
  const product = allProducts.find((product) => product.id === id);
  product.orders_counter++;

  const updatedProducts = JSON.stringify(allProducts, null, 2);
  fs.writeFile(filePath, updatedProducts, (err) => {
    if (err) console.error(err);
  });

  console.log(
    `Commande terminée. Voici votre fichier ${product.file_link} (${product.orders_counter})`
  );
}

getAllProducts();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", function (line) {
  getAllProducts(false, (err, data) => {
    if (err) return console.error(err);

    const elements = line.split(" ");
    const id = elements[elements.length - 1];
    orderProductById(id, data);
  });
});
