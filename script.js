let currentUUID = null;
let currentModel = "classic";

async function loadSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return showErrorState("Please enter a username!");

  try {
    const skinContainer = document.getElementById("skin-container");
    const loader = document.createElement("div");
    loader.className = "loading-spinner";
    skinContainer.appendChild(loader);

    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) throw new Error("Player not found");
    const data = await response.json();
    currentUUID = data.id;

    const skinImg = document.getElementById("skin-image");
    skinImg.style.transform = "rotateX(360deg)";

    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;

    skinImg.onload = () => {
      skinContainer.removeChild(loader);
      skinImg.style.transform = "rotateX(0)";
      updateModelIndicator();
      document.getElementById("error-message").classList.add("hidden");
    };

    const downloadLink = document.getElementById("download-link");
    downloadLink.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadLink.classList.remove("hidden");
  } catch (error) {
    const skinContainer = document.getElementById("skin-container");
    const loader = document.querySelector(".loading-spinner");
    if (loader) skinContainer.removeChild(loader);
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
  skinImg.style.transform = "rotateY(180deg) scale(0.8)";
  setTimeout(() => {
    skinImg.src = `https://crafatar.com/renders/body/${currentUUID}?size=512&overlay&model=${currentModel}`;
    skinImg.style.transform = "rotateY(0) scale(1)";
    updateModelIndicator();
  }, 300);
}

function randomSkin() {
  const users = ["Notch", "Dinnerbone", "Dream", "Technoblade", "Skeppy"];
  document.getElementById("username").value =
    users[Math.floor(Math.random() * users.length)];
  loadSkin();
}

function updateModelIndicator() {
  document.getElementById("model-indicator").textContent = `Current Model: ${
    currentModel.charAt(0).toUpperCase() + currentModel.slice(1)
  }`;
}

function showErrorState(message) {
  const skinImg = document.getElementById("skin-image");
  const errorBox = document.getElementById("error-message");

  skinImg.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  errorBox.querySelector("p").textContent = message;
  errorBox.classList.remove("hidden");
  document.getElementById("download-link").classList.add("hidden");

  setTimeout(() => {
    errorBox.classList.add("hidden");
  }, 5000);
}

document
  .getElementById("download-link")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(e.target.href);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${document
        .getElementById("username")
        .value.trim()}_skin.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showErrorState("Download failed!");
    }
  });
