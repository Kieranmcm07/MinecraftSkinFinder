let currentUUID = null;
let currentModel = "classic";
let is3DView = false;
const skinHistory = [];

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState("Enter a Minecraft username!");

  try {
    // Show animated loading
    const skinWrapper = document.getElementById("skin-wrapper");
    skinWrapper.classList.add("loading");

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

    // Add to history
    if (!skinHistory.includes(username)) {
      skinHistory.unshift(username);
      updateSkinHistory();
    }

    // Load skin with 3D effect
    const skinImg = document.getElementById("skin-image");
    skinImg.style.animation = "skinLoad 1s cubic-bezier(0.23, 1, 0.32, 1)";
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    skinImg.onload = () => {
      skinWrapper.classList.remove("loading");
      updateModelIndicator();
      if (is3DView) enable3DView();
    };

    // Update download link
    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");
  } catch (error) {
    showErrorState(error.message);
  }
}

function toggleModel() {
  if (!currentUUID) return;
  currentModel = currentModel === "classic" ? "slim" : "classic";
  document.getElementById(
    "skin-image"
  ).src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
  updateModelIndicator();
}

function enable3DView() {
  const skinWrapper = document.getElementById("skin-wrapper");
  skinWrapper.style.transform = "rotateX(15deg) rotateY(15deg)";
  skinWrapper.addEventListener("mousemove", handle3DMove);
  skinWrapper.addEventListener("mouseleave", reset3DView);
}

function handle3DMove(e) {
  const { clientX, clientY } = e;
  const { left, top, width, height } = e.target.getBoundingClientRect();
  const x = (clientX - left - width / 2) / 30;
  const y = (clientY - top - height / 2) / 30;
  e.target.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
}

function updateSkinHistory() {
  const historyContainer = document.getElementById("skin-history");
  historyContainer.innerHTML = skinHistory
    .slice(0, 4)
    .map(
      (username) =>
        `<div class="skin-history-item" onclick="loadUser('${username}')">${username}</div>`
    )
    .join("");
}

function loadUser(username) {
  document.getElementById("username").value = username;
  loadSkin();
}

// New 3D Viewer Toggle
document.getElementById("3d-toggle").addEventListener("click", function () {
  is3DView = !is3DView;
  this.classList.toggle("active");
  if (is3DView) enable3DView();
  else reset3DView();
});
