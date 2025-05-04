let currentUUID = null;
let skinHistory = JSON.parse(localStorage.getItem("skinHistory")) || [];
const popularPlayers = ["Notch", "Dream", "Technoblade", "Skeppy", "DanTDM"];

// Create particles
for (let i = 0; i < 50; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(particle);
}

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState("Please enter a username!");

  try {
    const skinImg = document.getElementById("skin-image");
    const downloadLink = document.getElementById("download-link");

    // Reset states
    skinImg.classList.add("loading");
    downloadLink.classList.add("hidden");
    skinImg.style.transform = "scale(0.95) rotateZ(-5deg)";

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      skinImg.classList.remove("loading");
      throw new Error("Player not found");
    }

    const data = await response.json();
    currentUUID = data.id;

    // Load new skin with cache busting
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&t=${Date.now()}`;

    skinImg.onload = () => {
      skinImg.classList.remove("loading");
      downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
      downloadLink.download = `${username}_skin.png`;
      downloadLink.classList.remove("hidden");
    };

    skinImg.onerror = () => {
      showErrorState("Failed to load skin image");
      downloadLink.classList.add("hidden");
    };

    updateHistory(username);
    hideErrorState();
  } catch (error) {
    showErrorState(error.message);
    skinImg.classList.remove("loading");
  }
}

function randomSkin() {
  const username =
    popularPlayers[Math.floor(Math.random() * popularPlayers.length)];
  document.getElementById("username").value = username;
  loadSkin();
}

function updateHistory(username) {
  if (!skinHistory.includes(username)) {
    skinHistory.unshift(username);
    if (skinHistory.length > 5) skinHistory.pop();
    localStorage.setItem("skinHistory", JSON.stringify(skinHistory));
    renderHistory();
  }
}

function renderHistory() {
  const historyContainer = document.getElementById("skin-history");
  historyContainer.innerHTML = skinHistory
    .map(
      (username) => `
    <div class="skin-history-item" 
         onclick="document.getElementById('username').value='${username}'; loadSkin()">
      👤 ${username}
    </div>
  `
    )
    .join("");
}

function showErrorState(message) {
  const errorBox = document.getElementById("error-message");
  errorBox.querySelector("p").textContent = message;
  errorBox.classList.add("visible");
  setTimeout(hideErrorState, 3000);
}

function hideErrorState() {
  document.getElementById("error-message").classList.remove("visible");
}

function toggleAbout() {
  document.querySelector(".about-section").classList.toggle("expanded");
}

document
  .getElementById("download-link")
  .addEventListener("click", function (e) {
    if (!currentUUID) {
      e.preventDefault();
      showErrorState("No skin loaded to download!");
      return;
    }
  });

// Initial setup
renderHistory();
