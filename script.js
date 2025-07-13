let currentUUID = null;
let skinHistory = JSON.parse(localStorage.getItem("skinHistory")) || [];
const popularPlayers = [
  "Notch",
  "Dream",
  "Technoblade",
  "Skeppy",
  "DanTDM",
  "CaptainSparklez",
  "Grian",
  "MumboJumbo",
  "iJevin",
  "GoodTimesWithScar",
  "Iskall85",
  "Xisuma",
  "FalseSymmetry",
  "Cubfan135",
  "ImpulseSV",
  "TangoTek",
  "ZombieCleo",
  "Bdubs",
  "Etho",
  "Hypixel",
  "StampyLongHead",
  "PrestonPlayz",
  "Vikkstar123",
  "JeromeASF",
  "SSundee",
  "PopularMMOs",
];

let lastRandomPlayer = null;
let isRandomCooldown = false;

let debounceTimer;
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState("Please enter a username!");

  try {
    const skinImg = document.getElementById("skin-image");
    const placeholder = document.querySelector(".placeholder-box");
    const downloadLink = document.getElementById("download-link");

    placeholder.style.opacity = "0";
    skinImg.classList.remove("loaded");
    downloadLink.classList.add("hidden");

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

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
    const skinImg = document.getElementById("skin-image");
    skinImg.classList.remove("loaded");
    throw error;
  }
}

function randomSkin(retries = 3) {
  const randomButton = document.getElementById("random-button");
  if (!randomButton) return;

  if (isRandomCooldown) {
    showErrorState("Please wait before trying again.");
    return;
  }

  isRandomCooldown = true;
  randomButton.disabled = true;

  setTimeout(() => {
    isRandomCooldown = false;
    randomButton.disabled = false;
  }, 1000);

  let username;
  do {
    username =
      popularPlayers[Math.floor(Math.random() * popularPlayers.length)];
  } while (username === lastRandomPlayer && popularPlayers.length > 1);

  lastRandomPlayer = username;
  document.getElementById("username").value = username;

  loadSkin()
    .then(() => console.log("Player loaded successfully."))
    .catch((error) => {
      if (error.message === "Player not found" && retries > 0) {
        console.warn(`Retrying... (${3 - retries + 1} attempt)`);
        setTimeout(() => randomSkin(retries - 1), 1000);
      } else {
        console.error("All retries failed:", error);
        showErrorState("Failed to load a random player. Please try again.");
      }
    });
}

function updateHistory(username) {
  if (!skinHistory.includes(username)) {
    skinHistory.unshift(username);
    if (skinHistory.length > 10) skinHistory.pop();
    localStorage.setItem("skinHistory", JSON.stringify(skinHistory));
    renderHistory();
  }
}

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

function clearHistory() {
  const list = document.getElementById("recent-searches-list");
  const items = list.querySelectorAll("li");

  items.forEach((item) => {
    item.classList.add("fade-out");
  });

  setTimeout(() => {
    skinHistory = [];
    localStorage.removeItem("skinHistory");
    renderHistory();
  }, 500);
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
  const aboutSection = document.querySelector(".about-section");
  aboutSection.classList.toggle("expanded");
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  document.body.setAttribute("data-theme", isDark ? "light" : "dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

document
  .getElementById("download-link")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    if (!currentUUID) {
      showErrorState("No skin loaded to download!");
      return;
    }

    const username =
      document.getElementById("username").value.trim() || "minecraft";
    const downloadUrl = `https://crafatar.com/skins/${currentUUID}`;

    try {
      const downloadBtn = document.getElementById("download-link");
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<span class="btn-shine"></span> DOWNLOADING...';
      downloadBtn.disabled = true;

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch skin");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${username}_skin.png`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      showErrorState("Download failed. Please try again.");
      document.getElementById("download-link").innerHTML =
        '<span class="btn-shine"></span> DOWNLOAD FAILED';
      setTimeout(() => {
        document.getElementById("download-link").innerHTML =
          '<span class="btn-shine"></span> DOWNLOAD SKIN';
      }, 2000);
    }
  });

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  renderHistory();
});
