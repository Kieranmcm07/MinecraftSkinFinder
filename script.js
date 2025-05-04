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
    skinImg.style.animation = "none";
    void skinImg.offsetWidth; // Trigger reflow
    skinImg.style.animation =
      "skinIntro 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay`;

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");

    updateHistory(username);
    hideErrorState();
  } catch (error) {
    showErrorState(error.message);
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
    e.preventDefault();
    const link = document.createElement("a");
    link.href = this.href;
    link.download = `${document
      .getElementById("username")
      .value.trim()}_skin.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

// Initial setup
renderHistory();
