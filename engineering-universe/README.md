# 🌌 CosmicVerse — Interactive 3D Portfolio

A fully immersive, space-themed portfolio built with **React**, **Three.js**, and **Framer Motion**. Navigate a solar system where each planet represents a different aspect of my engineering journey.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### 🪐 Interactive Solar System
- **Sun** — Identity hub with orbiting skill tags
- **Earth** — About Me & background
- **Mars** — DevOps skills with animated progress bars
- **Neptune** — ArthaMind (AI/Finance project)
- **Jupiter** — System Architecture & CI/CD concepts
- **Saturn** — Web3 Exploration
- **Pluto** — Contact information
- **Black Hole** — Resume download

### 🎬 Cinematic Entry
- Canvas-rendered starfield with warp-speed animation
- Shooting meteoroids with glowing trails
- Terminal boot sequence with typewriter effect
- Ambient space drone & sound effects

### 🔊 Procedural Sound Effects
All audio is synthesized in real-time using the **Web Audio API** — no external audio files:
- Sci-fi planet click chime
- Panel close tone
- Terminal keystroke beeps
- Ambient space hum
- Warp jump sweep

### ☄️ Meteoroid Effects
- 2D shooting stars on the cinematic entry page
- 18 animated 3D meteoroids streaking through the solar system

### 🚀 Deploy Mode
- Interactive Docker build simulation
- Terminal overlay with sequential glow propagation across planets

### 🎨 Futuristic UI
- Glassmorphism panels with color-matched glows
- Holographic HUD with gradient text
- Animated skill bars, orbiting tags, breathing indicators
- Custom neon scrollbars and selection colors

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| 3D Engine | Three.js + @react-three/fiber |
| 3D Helpers | @react-three/drei |
| Animations | Framer Motion |
| Styling | Tailwind CSS 4 |
| Audio | Web Audio API (procedural) |
| Build Tool | Vite 7 |
| Deployment | Docker + Nginx |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Abhishek200511/CosmicVerse-.git
cd CosmicVerse-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🐳 Docker

```bash
# Build the image
docker build -t cosmicverse .

# Run the container
docker run -p 80:80 cosmicverse
```

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Main app with phase management
├── main.jsx                   # Entry point
├── index.css                  # Tailwind config & custom animations
├── data/
│   └── constants.js           # Planet configs, skills, terminal lines
├── utils/
│   └── sounds.js              # Web Audio API sound synthesizer
└── components/
    ├── SolarSystem.jsx        # 3D scene: orbits, stars, nebulae
    ├── Sun.jsx                # Procedural sun with glow layers
    ├── Planet.jsx             # Procedural planets with atmospheres
    ├── BlackHole.jsx          # Accretion disk & gravitational lens
    ├── Meteoroids.jsx         # Animated shooting meteors
    ├── CinematicEntry.jsx     # Boot sequence & starfield warp
    ├── HUD.jsx                # Navigation overlay
    ├── PlanetPanel.jsx        # Modal panel container
    ├── DeployMode.jsx         # Docker build simulation
    └── panels/
        ├── AboutPanel.jsx
        ├── DevOpsPanel.jsx
        ├── ArthaMindPanel.jsx
        ├── ArchitecturePanel.jsx
        ├── Web3Panel.jsx
        ├── ContactPanel.jsx
        └── ResumePanel.jsx
```

---

## 👤 Author

**Abhishek Phukan**

- 📧 [abhishekphukan11@gmail.com](mailto:abhishekphukan11@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/abhishek-phukan-517610293)
- 🐙 [GitHub](https://github.com/Abhishek200511)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
