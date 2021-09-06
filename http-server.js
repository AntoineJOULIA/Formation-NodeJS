const http = require("http");

const HOSTNAME = "localhost";
const PORT = 3000;

const server = http.createServer((req, res) => {
  // res.statusCode = 200;
  // res.setHeader("Content-Type", "text/plain");
  // res.end("Hello la formation\n");

  // if (req.method === "POST") {
  //   let body = "";
  //   req.on("data", (chunk) => {
  //     body += chunk.toString();
  //   });
  //   req.on("end", () => {
  //     console.log(body);
  //     res.end("ok");
  //   });
  // }

  const url = req.url;
  if (url === "/about") {
    res.write("<h1>About us page</h1>");
    res.end();
  } else if (url === "/contact") {
    res.write("<h1>Contact us page</h1>");
    res.end();
  } else {
    res.write("<h1>Page not found...</h1>");
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`server running at http://${HOSTNAME}:${PORT}/`);
});
