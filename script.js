let currentUUID = null;
let currentModel = "classic";
let isLoading = false;

async function loadSkin() {
  if (isLoading) return;

  const username = document.getElementById("username").value.trim();
  if (!username) return;

  isLoading = true;
  const loadingBar = document.getElementById("loading-bar");
  const skinImg = document.getElementById("skin-image");

  skinImg.classList.add("loading");
  loadingBar.classList.remove("hidden");
  loadingBar.style.width = "0%";
  document.getElementById("error-message").classList.add("hidden");

  try {
    loadingBar.style.width = "30%";

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    loadingBar.style.width = "60%";

    if (!response.ok) throw new Error("Player not found");
    const data = await response.json();
    currentUUID = data.id;

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
    skinImg.onload = () => {
      skinImg.classList.remove("loading");
      skinImg.style.opacity = 0;
      setTimeout(() => (skinImg.style.opacity = 1), 50);
    };

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");

    loadingBar.style.width = "100%";
    setTimeout(() => loadingBar.classList.add("hidden"), 300);
  } catch (error) {
    showErrorState();
    console.error("Error:", error.message);
  } finally {
    isLoading = false;
  }
}

function toggleModel() {
  if (!currentUUID) {
    const btn = document.querySelector(".model-btn");
    btn.classList.add("shake");
    setTimeout(() => btn.classList.remove("shake"), 500);
    return;
  }

  currentModel = currentModel === "classic" ? "slim" : "classic";
  const skinImg = document.getElementById("skin-image");
  skinImg.classList.add("pixelate");

  setTimeout(() => {
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
    setTimeout(() => skinImg.classList.remove("pixelate"), 300);
  }, 300);
}

function showErrorState() {
  const skinContainer = document.getElementById("skin-container");
  const errorBox = document.getElementById("error-message");
  const skinImg = document.getElementById("skin-image");

  skinImg.src = "https://i.imgur.com/9E8ZzJG.png";
  errorBox.classList.remove("hidden");
  document.getElementById("download-link").classList.add("hidden");
}
