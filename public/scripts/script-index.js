async function order(id) {
  const response = await fetch(`http://localhost:3000/${id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  if (response.status === 200) {
    const product = await response.json();
    validateOrder(product);
  } else {
    fetch("http://localhost:3000/auth");
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
    `[data-product-id="${product.id}"]`
  );
  const tdToUpdate = rowToUpdate.children[3];
  tdToUpdate.innerHTML = product.orders_counter;
  return product;
}

async function getOrders() {
  const response = await fetch(`http://localhost:3000/orders`);
  const orders = await response.json();
  console.log("The orders:");
  console.log(orders);
}

async function getProducts() {
  const response = await fetch("http://localhost:3000/products");
  const products = await response.json();
  console.log("The products:");
  console.table(products);
}
