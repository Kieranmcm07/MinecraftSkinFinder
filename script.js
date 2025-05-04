let currentUUID = null;
let currentModel = "classic";
let skinHistory = JSON.parse(localStorage.getItem("skinHistory")) || [];
const popularPlayers = [
  "Notch",
  "Dream",
  "Technoblade",
  "Skeppy",
  "DanTDM",
  "StampyCat",
  "CaptainSparklez",
  "Aphmau",
];

// Particle background
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
    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

    const skinImg = document.getElementById("skin-image");
    skinImg.style.opacity = 0;

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    skinImg.onload = () => {
      skinImg.style.opacity = 1;
      document.getElementById("error-message").classList.add("hidden");
      updateHistory(username);
    };

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");
  } catch (error) {
    showErrorState(error.message);
  }
}

function toggleModel() {
  if (!currentUUID) {
    showErrorState("Load a skin first!");
    return;
  }
  currentModel = currentModel === "classic" ? "slim" : "classic";
  const skinImg = document.getElementById("skin-image");
  skinImg.style.opacity = 0;
  setTimeout(() => {
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
    skinImg.style.opacity = 1;
  }, 300);
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
    <div class="skin-history-item" onclick="document.getElementById('username').value='${username}'; loadSkin()">
      ${username}
    </div>
  `
    )
    .join("");
}

function showErrorState(message) {
  const errorBox = document.getElementById("error-message");
  errorBox.querySelector("p").textContent = message;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 5000);
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
