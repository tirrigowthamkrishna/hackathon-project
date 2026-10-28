# LastBite &bull; Food-Expiry Rescue & Local Surplus Exchange

> **"A role-based platform connecting surplus food donors with nearby receivers — before it expires."**  
> Built for real commercial kitchens, community shelters, and field logistics.

---

## 🎨 Visual Identity & Palette
- **Tomato Red** (`#E1372D`): Urgent countdowns, rescue actions, critical alerts.
- **Mustard Gold** (`#E5A93C`): Time-sensitive alerts, match badges, custody verification.
- **Warm Cream** (`#FAF8F5`): Canvas background and card container surfaces.
- **Charcoal** (`#1F2421`): High-contrast typography and industrial badges.
- **Emerald** (`#16A34A`): Verified meal savings and carbon offset indicators.

---

## 🚀 Key Functional Modules Implemented

### 1. Searchable Listings with Live Countdown Timers (Slide 04 & 05)
- Every surplus batch displays a live second-by-second countdown timer calculated against food safety standards.
- Visual Urgency Coding:
  - 🔴 **Urgent Rescue** (`< 2 hours` remaining)
  - 🟡 **Time Sensitive** (`2 - 6 hours` remaining)
  - 🟢 **Scheduled Window** (`> 6 hours` remaining)
- Real-time geofenced radius filter (1 km to 12 km slider) with Haversine distance calculations.
- Category filters (Prepared Meals, Bakery & Pastries, Fresh Produce, Dairy & Eggs, Pantry & Grains).

### 2. 5-Factor Smart Matching Engine (Slide 03, 04, 05)
A dynamic matching score (0 - 99%) calculated based on:
1. **Travel Distance & Radius (30% weight):** Filters out donors outside the receiver's travel boundary.
2. **Remaining Shelf-Life vs Transit Time (25% weight):** Ensures safe distribution buffer before consumption.
3. **Storage Condition Compatibility (20% weight):** Validates Hot-Hold (≥60°C), Cold Chain (1-4°C), Ambient, or Frozen capabilities.
4. **Quantity vs Vehicle/Facility Capacity (15% weight):** Matches batch weight against receiver vehicle limits.
5. **Pickup Window Overlap (10% weight):** Checks alignment between kitchen closing and receiver arrival.

*Includes a dedicated **"Matching Engine Simulator"** tab with interactive sliders to inspect how weights affect matching scores.*

### 3. Complete Audit Trail & Chain of Custody (Slide 04 & 05)
Every surplus listing moves through verifiable lifecycle states:
- `Listed` &rarr; `Claimed / Accepted` &rarr; `In Transit` &rarr; `Verified Collected` &rarr; `Expired`
- **Doorstep Verification:** Uses a unique 4-digit Handover Token (`LB-XXXX`) to confirm safe physical handoff between the donor kitchen manager and receiver driver.
- Real-time celebration confetti upon verified rescue.
- Audited timeline log for each batch with actor identities, timestamps, and food condition notes.
- One-click **Export Audited CSV Ledger** for compliance and institutional reporting.

### 4. Real-Time Diversion Metrics & UNEP Food Waste Index (Slide 04, 06, 07)
Integrates scientific benchmarks:
- **Meal Conversion:** 1 Meal ≈ 0.42 kg (420g edible portion per UNEP baseline).
- **Greenhouse Gas Offset:** 1 kg food waste diverted avoids **2.5 kg CO₂e**.
- **Water Footprint Preserved:** 1 kg food waste diverted saves **1,000 Litres** of freshwater.
- Live Diversion Rate calculation (% of listed food rescued vs discarded).

### 5. Interactive OpenStreetMap Geofence (Slide 06)
- Leaflet.js interactive map centered on local district.
- Receiver station marker with travel boundary radius circle.
- Pulsing red/amber markers for active surplus kitchens with direct claim popups.

---

## 🏃 How to Run the Prototype

### Option 1: Direct Browser Launch (Zero Installation)
Simply open the `index.html` file in any modern web browser:
```bash
# On Windows PowerShell:
Start-Process "file:///C:/Users/Admin/.gemini/antigravity/scratch/lastbite-app/index.html"
```
Or double-click `index.html` in File Explorer.

### Option 2: Local HTTP Dev Server
Run the built-in zero-dependency Node HTTP server:
```bash
cd "C:\Users\Admin\.gemini\antigravity\scratch\lastbite-app"
npm start
# Server listens at http://localhost:3000
```

---

## 📂 Project Directory Structure

```
lastbite-app/
├── index.html            # Main web app layout with Tailwind & Leaflet
├── server.js             # Zero-dependency Node.js HTTP server
├── build.js              # Bundler combining modules for offline compatibility
├── package.json          # Project metadata and run scripts
├── README.md             # Architecture documentation
└── src/
    ├── app.js            # Main application controller, state & DOM events
    ├── bundle.js         # Single unified bundle for zero-CORS browser execution
    ├── data/
    │   └── mockData.js   # Pre-seeded surplus listings & UNEP constants
    └── utils/
        ├── engine.js     # 5-factor matching algorithm & UNEP calculators
        └── mapHelper.js  # OpenStreetMap & Leaflet pin generator
```
