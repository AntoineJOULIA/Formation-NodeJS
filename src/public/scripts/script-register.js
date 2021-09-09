const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  const credentials = { email, password };
  // let response = await fetch(`http://localhost:3000/register`, {
  let response = await fetch(`/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (data.signin) {
    window.location.href = "/";
  }
});
