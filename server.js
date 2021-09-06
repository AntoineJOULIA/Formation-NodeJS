const path = require("path");
const express = require("express");
const app = express();

const port = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("homepage"));

app.listen(port, () =>
  console.log(`Server started. Listening to port ${port}`)
);
