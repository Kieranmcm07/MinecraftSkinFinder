let currentUUID = null;
let currentModel = "classic";

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState();

  try {
    const skinContainer = document.getElementById("skin-container");
    const loader = document.createElement("div");
    loader.className = "loading-spinner";
    loader.innerHTML = "⌛";
    skinContainer.appendChild(loader);

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) throw new Error("Player not found");
    const data = await response.json();
    currentUUID = data.id;

    const skinImg = document.getElementById("skin-image");
    skinImg.classList.remove("skin-loaded");

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    skinImg.onload = () => {
      skinContainer.removeChild(loader);
      skinImg.classList.add("skin-loaded");
      document.getElementById("error-message").classList.add("hidden");
    };

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");
  } catch (error) {
    showErrorState();
    console.error("Error:", error.message);
  }
}

function toggleModel() {
  if (!currentUUID) {
    alert("Please load a skin first!");
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

function showErrorState() {
  const skinImg = document.getElementById("skin-image");
  const errorBox = document.getElementById("error-message");

  skinImg.src = "https://i.imgur.com/9E8ZzJG.png";
  errorBox.classList.remove("hidden");
  document.getElementById("download-link").classList.add("hidden");
}
