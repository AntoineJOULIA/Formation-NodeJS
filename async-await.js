function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}
async function asyncCall() {
  /// SYNTAXE SYNCHRONE
  console.log("calling");
  const result = await resolveAfter2Seconds();
  console.log(result);
}

asyncCall();
