// const myPromise = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     resolve("fine 1");
//   }, 2000);
// })
//   .then(function whenOk(response) {
//     console.log("log 1", response);
//     return new Promise(function (resolve, reject) {
//       setTimeout(() => {
//         resolve("fine 2");
//       }, 2000);
//     }).then(function whenOk(response) {
//       console.log("log 3", response);
//       return response;
//     });
//   })
//   .then(function whenOk(response) {
//     console.log("log 2", response);
//     return response;
//   })
//   .catch(function notOk(err) {
//     console.error(err);
//   });

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("fine 1");
  }, 2000);
})
  .then((response) => {
    console.log("log 1", response);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("fine 2");
      }, 2000);
    }).then((response) => {
      console.log("log 3", response);
      return response;
    });
  })
  .then((response) => {
    console.log("log 2", response);
    return response;
  })
  .catch((err) => {
    console.error(err);
  });
