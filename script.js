let currentUUID = null;
let skinHistory = JSON.parse(localStorage.getItem("skinHistory")) || [];
const popularPlayers = ["Notch", "Dream", "Technoblade", "Skeppy", "DanTDM"];

// Debounce function to prevent spamming
let debounceTimer;
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

// Load skin by username
async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState("Please enter a username!");

  try {
    const skinImg = document.getElementById("skin-image");
    const placeholder = document.querySelector(".placeholder-box");
    const downloadLink = document.getElementById("download-link");

    // Start transition
    placeholder.style.opacity = "0";
    skinImg.classList.remove("loaded");
    downloadLink.classList.add("hidden");

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

    // Load new skin
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&t=${Date.now()}`;

    skinImg.onload = () => {
      skinImg.classList.add("loaded");
      downloadLink.classList.remove("hidden");
    };

    updateHistory(username);
    hideErrorState();
  } catch (error) {
    showErrorState(error.message);
    document.querySelector(".placeholder-box").style.opacity = "1";
    skinImg.classList.remove("loaded");
  }
}

// Fetch and display a random skin
function randomSkin() {
  debounce(() => {
    const username =
      popularPlayers[Math.floor(Math.random() * popularPlayers.length)];
    document.getElementById("username").value = username;
    loadSkin();
  }, 300); // 300ms debounce delay
}

// Update Recent Searches
function updateHistory(username) {
  if (!skinHistory.includes(username)) {
    skinHistory.unshift(username);
    if (skinHistory.length > 10) skinHistory.pop(); // Limit to 10 entries
    localStorage.setItem("skinHistory", JSON.stringify(skinHistory));
    renderHistory();
  }
}

// Render Recent Searches
function renderHistory() {
  const historyContainer = document.getElementById("recent-searches-list");
  historyContainer.innerHTML = skinHistory
    .map(
      (username) => `
    <li class="skin-history-item" 
        onclick="document.getElementById('username').value='${username}'; loadSkin()">
      👤 ${username}
    </li>
  `
    )
    .join("");
}

// Clear History Function
function clearHistory() {
  skinHistory = [];
  localStorage.removeItem("skinHistory");
  renderHistory();
}

// Display error messages
function showErrorState(message) {
  const errorBox = document.getElementById("error-message");
  errorBox.querySelector("p").textContent = message;
  errorBox.classList.add("visible");
  setTimeout(hideErrorState, 3000);
}

function hideErrorState() {
  document.getElementById("error-message").classList.remove("visible");
}

// Toggle About Section
function toggleAbout() {
  const aboutSection = document.querySelector(".about-section");
  aboutSection.classList.toggle("expanded");
}

// Download Skin Functionality
document.getElementById("download-link").addEventListener("click", (e) => {
  e.preventDefault();
  if (!currentUUID) {
    showErrorState("No skin loaded to download!");
    return;
  }
  const username =
    document.getElementById("username").value.trim() || "minecraft";
  const downloadUrl = `https://crafatar.com/skins/${currentUUID}`;
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${username}_skin.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Initial setup
window.addEventListener("load", () => {
  renderHistory();
});
