document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[username];

  if (user && user.password === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "Invalid username or password!";
  }
});
