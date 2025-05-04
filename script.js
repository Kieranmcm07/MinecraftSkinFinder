let currentUUID = null;
let currentModel = "classic";

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState();

  try {
    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    if (!response.ok) throw new Error("Player not found");

    const data = await response.json();
    currentUUID = data.id;

    const skinImg = document.getElementById("skin-image");
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");

    document.getElementById("error-message").classList.add("hidden");
  } catch (error) {
    showErrorState();
    console.error("Error:", error.message);
  }
}

function toggleModel() {
  if (!currentUUID) return;
  currentModel = currentModel === "classic" ? "slim" : "classic";
  document.getElementById(
    "skin-image"
  ).src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
}

function showErrorState() {
  const skinContainer = document.getElementById("skin-container");
  const errorBox = document.getElementById("error-message");
  const skinImg = document.getElementById("skin-image");

  skinImg.src = "https://i.imgur.com/9E8ZzJG.png"; // 404 image
  errorBox.classList.remove("hidden");
  document.getElementById("download-link").classList.add("hidden");
}

// Initial load with error state
window.onload = showErrorState;
