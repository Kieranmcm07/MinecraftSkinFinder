<p align="center">
  <h1 align="center">Minecraft Skin Viewer</h1>
  <p align="center">View and download any Minecraft player's skin instantly</p>
  <p align="center">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/Platform-Web-brightgreen" alt="Platform">
    <img src="https://img.shields.io/badge/Minecraft-All_Versions-blue" alt="Minecraft Versions">
  </p>
</p>

## 🌟 Features

- **Instant Skin Viewing** - See any player's skin by entering their username
- **One-Click Download** - Save skins as PNG files with a single click
- **Search History** - Automatically remembers your recent searches
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Clean Interface** - Minecraft-themed UI with intuitive controls

## 🚀 How to Use

1. **Enter Username**  
   Type any Minecraft player's name in the search field
   
2. **View Skin**  
   Click "View Skin" to render the player's skin

3. **Download or Share**  
   Use the download button to save the skin or share it with friends

## 🧰 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Minecraft API**: Mojang API + Crafatar
- **UI Design**: Minecraft-inspired interface
- **Hosting**: GitHub Pages (or your hosting solution)

## 🖥️ Preview

```html
<!-- Simple preview of the interface -->
<div style="background: #1e1e1e; padding: 20px; border-radius: 10px;">
  <div style="display: flex; justify-content: center; margin-bottom: 20px;">
    <input type="text" placeholder="Enter Minecraft username" style="padding: 10px; width: 300px; border: 2px solid #5b9c64; background: #2d2d2d; color: white;">
    <button style="margin-left: 10px; padding: 10px 20px; background: #5b9c64; color: white; border: none; cursor: pointer;">View Skin</button>
  </div>
  <div style="display: flex; justify-content: center;">
    <div style="width: 200px; height: 300px; background: #2d2d2d; border: 2px solid #5b9c64; position: relative;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #888; text-align: center;">
        Skin Preview<br>Will Appear Here
      </div>
    </div>
  </div>
</div>