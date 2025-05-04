async function getSkin() {
  const username = document.getElementById("username").value.trim();
  const output = document.getElementById("output");
  output.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
    `;

  try {
    // Use Netlify Function from previous example
    const response = await fetch(
      `/.netlify/functions/get-uuid?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      throw new Error("Username not found");
    }

    const data = await response.json();
    const uuid = data.id;
    const displayName = data.name || username;

    output.innerHTML = `
            <div class="skin-display fade-in">
                <h2>${displayName}'s Skin</h2>
                <div class="skin-model">
                    <img src="https://crafatar.com/renders/body/${uuid}?size=512&default=MHF_Steve&overlay" 
                         alt="${displayName}'s Skin"
                         class="model-animation">
                </div>
                <div class="action-buttons">
                    <button class="toggle-btn" onclick="toggleModel('${uuid}')">Toggle Model</button>
                    <a href="https://crafatar.com/skins/${uuid}" 
                       class="download-btn" 
                       download="${displayName}-skin.png">
                        Download Skin
                    </a>
                </div>
            </div>
        `;
  } catch (e) {
    output.innerHTML = `
            <div class="error fade-in">
                <p>Error: ${e.message}</p>
            </div>
        `;
  }
}

function toggleModel(uuid) {
  const img = document.querySelector(".skin-model img");
  const currentSrc = img.src;

  const newModel = currentSrc.includes("model=classic") ? "slim" : "classic";
  img.src = currentSrc.replace(/model=\w+/, `model=${newModel}`);
}

// Particle animation
function createParticles() {
  const particles = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.width = particle.style.height = `${Math.random() * 4}px`;
    particle.style.animationDuration = `${5 + Math.random() * 10}s`;
    particles.appendChild(particle);
  }
}

window.onload = () => {
  createParticles();
  document.getElementById("username").value = "Notch";
};
