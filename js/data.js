let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];

function saveData() {
  localStorage.setItem("rooms", JSON.stringify(rooms));
  localStorage.setItem("applications", JSON.stringify(applications));
}
