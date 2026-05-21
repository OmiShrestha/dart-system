# DART — Dynamic Automatic Reactive Targets

A portfolio/showcase site for the DART embedded systems capstone project — a networked shooting range built on nRF52840, Zephyr RTOS, and BLE Mesh.

## What it is

DART is a system of motorized, sensor-instrumented targets orchestrated wirelessly from a tablet at the firing line. Each node runs custom firmware on the nRF52840 SoC, communicates over a BLE Mesh fabric, and reports hit telemetry in real time. This repo contains the project showcase site.

## Tech stack (firmware)

| Component | Detail |
|---|---|
| SoC | nRF52840 |
| RTOS | Zephyr v2.9.2 |
| RF | BLE Mesh (TTL 10, relay-to-provisioner) |
| RF Front-end | nRF21540 FEM |
| OTA Updates | MCUboot + Zephyr DFU |
| Debugging | Segger RTT |
| Hit Detection | Magnetic sensor, 50 ms poll, 500 ms arm delay |
| Motor Control | DC motor, two-stage PWM travel profile |
| Build System | CMake + Ninja · Kconfig · west |

## Site structure

```
dart-system/
├── index.html          # Single-page site
├── css/
│   └── styles.css      # All styles, theming, layout
├── js/
│   ├── config.js       # Runtime theme/accent config (DART_TWEAKS)
│   ├── app.jsx         # Scroll reveals, cursor, interactions
│   ├── cursor.js       # Custom cursor logic
│   └── tweaks-panel.jsx# Live tweaks panel
├── icons/              # Brand SVG icons (Gmail, LinkedIn, Instagram, GitHub)
└── fonts/              # Self-hosted WOFF2 typefaces
```

## Configuration

Edit `js/config.js` to change the site's appearance without touching CSS:

```js
window.DART_TWEAKS = {
  "theme": "light",        // "light" | "dark"
  "accent": "#FF5A1F",     // hex accent color
  "displayFont": "grotesk",
  "density": "comfortable",
  "showCursor": true,
  "showMarquee": true,
  "marqueeSpeed": 60,
  "headlineStyle": "mixed"
};
```

## Running locally

No build step required — open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

## Contact

[Email](mailto:work.omishrestha@gmail.com) · [LinkedIn](https://linkedin.com/in/omishrestha) · [Instagram](https://instagram.com/omishrestha) · [GitHub](https://github.com/OmiShrestha)
