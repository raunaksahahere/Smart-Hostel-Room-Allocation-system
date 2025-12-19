/***********************
 * Firebase Imports
 ***********************/
import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/***********************
 * Auth Protection
 ***********************/
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

/***********************
 * DOM Elements
 ***********************/
const addRoomBtn = document.getElementById("addRoomBtn");
const allocateBtn = document.getElementById("allocateBtn");
const resultList = document.getElementById("resultList");

const roomIdInput = document.getElementById("roomId");
const roomTypeSelect = document.getElementById("roomType");
const priceInput = document.getElementById("price");

/***********************
 * Add Room (Admin)
 ***********************/
addRoomBtn.addEventListener("click", async () => {
  const roomId = roomIdInput.value.trim();
  const roomType = roomTypeSelect.value;
  const price = Number(priceInput.value);

  if (!roomId || !price) {
    alert("Please fill all room details");
    return;
  }

  try {
    await addDoc(collection(db, "rooms"), {
      roomId: roomId,
      type: roomType,
      price: price,
      available: true,
      createdAt: Date.now()
    });

    alert("Room added successfully ✅");

    roomIdInput.value = "";
    priceInput.value = "";

  } catch (error) {
    console.error(error);
    alert("Error adding room");
  }
});

/***********************
 * AI-STYLE AUTO ALLOCATION
 ***********************/
allocateBtn.addEventListener("click", async () => {
  resultList.innerHTML = "";

  try {
    // Fetch rooms & applications
    const roomSnap = await getDocs(collection(db, "rooms"));
    const appSnap = await getDocs(collection(db, "applications"));

    let rooms = roomSnap.docs.map(d => ({
      ...d.data(),
      docId: d.id
    }));

    let applications = appSnap.docs.map(d => ({
      ...d.data(),
      docId: d.id
    }));

    // Allocation Logic
    for (let app of applications) {
      if (app.status !== "Pending") continue;

      let bestRoom = null;
      let bestScore = -1;

      for (let room of rooms) {
        if (!room.available) continue;

        let score = 0;

        // Preference match
        if (room.type === app.roomType) score += 50;

        // Budget check
        if (room.price <= app.budget) score += 30;

        // Price closeness
        score += Math.max(0, 20 - Math.abs(room.price - app.budget));

        if (score > bestScore) {
          bestScore = score;
          bestRoom = room;
        }
      }

      // Assign best room
      if (bestRoom) {
        await updateDoc(doc(db, "rooms", bestRoom.docId), {
          available: false
        });

        await updateDoc(doc(db, "applications", app.docId), {
          status: `Allocated ${bestRoom.roomId}`
        });

        resultList.innerHTML += `
          <li>
            Application ${app.docId} → Room ${bestRoom.roomId}
          </li>
        `;

        bestRoom.available = false;
      }
    }

    if (resultList.innerHTML === "") {
      resultList.innerHTML = "<li>No pending applications</li>";
    }

    alert("Auto allocation completed 🎯");

  } catch (error) {
    console.error(error);
    alert("Allocation failed");
  }
});
