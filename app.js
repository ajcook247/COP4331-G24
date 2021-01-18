// Anna Malaj, Matthew Gomez
// COP 4331, Spring 2021
// 1/17/2021

function showPassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

