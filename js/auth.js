console.log("auth.js loaded"); // DEBUG LINE

const loginBtn = document.getElementById("loginBtn");

if (!loginBtn) {
  console.error("Login button not found!");
}

loginBtn.addEventListener("click", () => {
  console.log("Login button clicked");

  const role = document.getElementById("role").value;

  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "student.html";
  }
});
