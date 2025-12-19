console.log("student.js loaded"); // DEBUG

const applyBtn = document.getElementById("applyBtn");
const statusText = document.getElementById("statusText");

if (!applyBtn) {
  console.error("Apply button not found");
}

applyBtn.addEventListener("click", () => {
  console.log("Apply button clicked");

  const roomType = document.getElementById("roomType").value;
  const budget = document.getElementById("budget").value;

  if (!budget) {
    alert("Please enter budget");
    return;
  }

  statusText.innerText =
    `Application submitted for ${roomType} room ✅`;
});
