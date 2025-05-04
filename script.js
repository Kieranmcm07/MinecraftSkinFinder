let currentUUID = null;
let currentModel = "classic";
let skinHistory = JSON.parse(localStorage.getItem("skinHistory")) || [];

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
    skinImg.classList.remove("loaded");
    skinImg.style.opacity = 0;

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    skinImg.onload = () => {
      skinImg.style.opacity = 1;
      skinImg.classList.add("loaded");
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
  updateModelIndicator();
}

function updateHistory(username) {
  if (!skinHistory.includes(username)) {
    skinHistory.unshift(username);
    localStorage.setItem("skinHistory", JSON.stringify(skinHistory));
    renderHistory();
  }
}

function renderHistory() {
  const historyContainer = document.getElementById("skin-history");
  historyContainer.innerHTML = skinHistory
    .slice(0, 5)
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
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = e.target.href;
    link.download = `${document
      .getElementById("username")
      .value.trim()}_skin.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

// Initial history render
renderHistory();
