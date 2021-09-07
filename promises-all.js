const p1 = new Promise((resolve, reject) => {
  setTimeout(
    (param) => {
      console.log(param);
      resolve(param);
    },
    1000,
    "un"
  );
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(
    (param) => {
      console.log(param);
      resolve(param);
    },
    2000,
    "deux"
  );
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(
    (param) => {
      console.log(param);
      resolve(param);
    },
    3000,
    "trois"
  );
});
const p4 = new Promise((resolve, reject) => {
  setTimeout(
    (param) => {
      console.log(param);
      resolve(param);
    },
    4000,
    "quatre"
  );
});
const p5 = new Promise((resolve, reject) => {
  reject("rejet");
});

Promise.all([p1, p2, p3, p4, p5])
  .then((values) => console.log("all then", values))
  .catch((reason) => console.error("all catch", reason));
