let currentModel = "classic";
let currentUUID = "";

async function getSkin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return;

  try {
    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );
    const data = await response.json();

    currentUUID = data.id;
    const displayName = data.name || username;

    document.getElementById(
      "skin-image"
    ).src = `https://crafatar.com/renders/body/${currentUUID}?size=512&model=${currentModel}`;

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.href = `https://crafatar.com/skins/${currentUUID}`;
    downloadBtn.classList.remove("hidden");

    // Enderman effect
    const enderman = document.getElementById("enderman");
    enderman.style.left = `${Math.random() * 80}%`;
    enderman.style.opacity = "1";
    setTimeout(() => (enderman.style.opacity = "0"), 1000);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function toggleModel() {
  currentModel = currentModel === "classic" ? "slim" : "classic";
  document.getElementById(
    "skin-image"
  ).src = `https://crafatar.com/renders/body/${currentUUID}?size=512&model=${currentModel}`;

  // Add flip animation
  const skinImage = document.getElementById("skin-image");
  skinImage.style.transform = "rotateY(180deg)";
  setTimeout(() => (skinImage.style.transform = "rotateY(0deg)"), 500);
}

// Create particles
function createParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.width = particle.style.height = Math.random() * 4 + "px";
    particle.style.animationDuration = Math.random() * 5 + 3 + "s";
    container.appendChild(particle);
  }
}

window.onload = () => {
  createParticles();
  document.getElementById("username").value = "Kieran";
};
