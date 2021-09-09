const orderButtons = document.querySelectorAll("[data-type='order-btn'");
const getOrdersButton = document.getElementById("get-orders-btn");
const getProductsButton = document.getElementById("get-products-btn");

[...orderButtons].forEach((button) => {
  button.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    order(productId);
  });
});

getOrdersButton.onclick = () => getOrders();
getProductsButton.onclick = () => getProducts();

async function order(id) {
  // const response = await fetch(`http://localhost:3000/${id}`, {
  const response = await fetch(`/${id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  if (response.status === 200) {
    const product = await response.json();
    validateOrder(product);
  } else {
    // fetch("http://localhost:3000/auth");
    fetch("/auth");
  }
}

function validateOrder(product) {
  updateRow(product);
  alert(
    `Commande terminée.
  Voici votre fichier ${product.file_link} (${product.orders_counter})`
  );
}

function updateRow(product) {
  const rowToUpdate = document.querySelector(
    `[data-product-row="${product.id}"]`
  );
  const tdToUpdate = rowToUpdate.children[3];
  tdToUpdate.innerHTML = product.orders_counter;
  return product;
}

async function getOrders() {
  // const response = await fetch(`http://localhost:3000/orders`);
  const response = await fetch(`/orders`);
  const orders = await response.json();
  console.log("The orders:");
  console.log(orders);
}

async function getProducts() {
  // const response = await fetch("http://localhost:3000/products");
  const response = await fetch("/products");
  const products = await response.json();
  console.log("The products:");
  console.table(products);
}
