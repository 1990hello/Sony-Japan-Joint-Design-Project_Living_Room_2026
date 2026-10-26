# Lumori Living Room Prototype — Sony NTU NITech Joint Design Workshop 2026

An interactive, first-person AR-style living-room prototype created for the **Sony NTU NITech Joint Design Workshop 2026**.

The experience features the **Lumori** creatures emerging from a physical-looking magical glass orb on a living-room shelf to explore the room, interact with the **Broken Windmill Field** diorama on the coffee table (based on the design team's Miro storyboard), cooperate to solve problems, play on the sofa, and return home to their persistent miniature world.

---

## ⚠️ Important: Independent Repository Notice

This is an **independent, separate application** from the previous corridor/bedroom prototype.

- **Protected Existing Repository**: `https://github.com/1990hello/Sony-Japan-Joint-Design-Project_2026`  
  *Published at*: `https://1990hello.github.io/Sony-Japan-Joint-Design-Project_2026/` (Protected & untouched).
- **New Target Repository**: `https://github.com/1990hello/Sony-Japan-Joint-Design-Living-Room-2026`  
  *Expected Published URL*: `https://1990hello.github.io/Sony-Japan-Joint-Design-Living-Room-2026/`

This project includes its own dedicated configuration, assets, base path (`/Sony-Japan-Joint-Design-Living-Room-2026/`), and automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

---

## 🎨 Authoritative Character References (`image_f00e7209.png`)

The four authentic Lumori characters faithfully implemented in the application:

1. **Sprout Lumi (Blue)**: Sky blue body, sunny yellow belly, green plant stem with leafy sprout, droopy blue/yellow ears, crossbody leaf satchel with white pod.
2. **Bellflower Lumi (Mint)**: Mint seafoam body, pale yellow belly, arching stem with hanging bellflower cup, droopy mint ears, crossbody leaf satchel.
3. **Sakura Lumi (Pink)**: Lilac-pink body, peach-cream belly, woody twig with blooming cherry blossom flowers, petal-shaped ears, crossbody leaf satchel.
4. **Lotus Lumi (Purple)**: Royal purple body, warm cream belly, majestic blooming lotus flower with radiant center light, long lashes, crossbody leaf satchel.

---

## 🌾 Broken Windmill Field Storyboard Sequence (`image_ddf866d7.png`)

The coffee table activity faithfully implements the 6 storyboard stages via deterministic sub-states:

- **State 2A — Discovery**: A miniature field with rustic wooden windmill appears on the coffee table. The camera smoothly zooms in (2.05x) to frame the coffee table diorama.
- **State 2B — Observation**: The Lumori inspect the stalled blades. Sakura walks over to the wooden crate, inspects the tools, and brings a small wrench to Lotus at the base cog while Sprout inspects the axle.
- **State 2C — Invitation**: The Lumori gesture toward the user inviting help. A subtle visual cue appears (blowing breath icon, rotating arrow ring around the hub).
- **State 2D — User Interaction**: The user assists by waving, performing a pinch gesture near the windmill, or clicking the windmill. The blades catch the breeze and accelerate.
- **State 2E — Autonomous Solution**: If the user chooses not to interact within 6.5s, the Lumori coordinate their efforts (tapping the cog and pushing the blades in unison) to unlock the mechanism autonomously.
- **State 2F — Success**: The windmill spins smoothly with a golden blur. Glowing flower petals and pollen drift into the air; all four Lumori cheer, jump, and celebrate (`♫`, `♥`, `^.^`).
- **State 2G — Closure**: The activity gradually settles. The Lumori rest contentedly near the working windmill.
- **State 2_ZOOM_OUT — Camera Zoom Out**: The camera smoothly pulls back (1.4s ease-in-out) from 2.05x to 1.0x to frame the full living room before the sofa adventure begins.

---

## 🛠️ Key Bug Fixes & Architectural Improvements

1. **Deterministic Sofa Rescue State Machine Progression**:
   - **Root Cause**: The rescue handler set `moriRescued = true`, which re-rendered the parent component and triggered the cleanup function of the component's `useEffect`, cancelling the timeout before it could fire.
   - **Fix**: Separated rescue into explicit phases: `STATE_4_HELPING_FRIEND` $\rightarrow$ `STATE_4B_RESCUED_REUNION` $\rightarrow$ `STATE_5_FREE_PLAY`. Handled automatically within the deterministic `LumoriStateMachine` with its own un-cancelled class timer (`addTimer`). No extra pinch or click is required after rescue.
2. **Smooth Camera Zoom-In & Zoom-Out**:
   - During Broken Windmill Field states (2A–2G), the scene smoothly scales by 2.05x centered on the coffee table (`38% 74%`).
   - In `STATE_2_ZOOM_OUT`, it smoothly animates back to 1.0x over 1.4 seconds before Sprout and Bellflower head to the sofa.
3. **Furniture Color Tuning (Sofa & Coffee Table Only)**:
   - **Sofa**: Darkened to medium warm taupe / greige (`#8C7D70`–`#6E6156`) with distinct seat cushions and a defined crevice.
   - **Coffee Table**: Darkened to rich medium walnut / smoked-oak (`#6D5340`–`#4A3425`) with subtle warm amber grain highlights.
   - **Walls, Floor & Shelf**: Preserved bright, warm Scandinavian cream and blond oak tones.
4. **Windmill Blade Pivot Alignment & Persistent Rotation**:
   - Concentric axle pivot: Aligned rotating container and center hub inside a zero-size centered flex container at `(0, 0)` origin, eliminating pivot drift.
   - Persistent rotation: Windmill blades continue rotating smoothly in the background through States 3, 4, 4B, 5, 6, and 7 once repaired.
5. **Corrected Sofa Jump Trajectory & Crevice Position**:
   - Sprout jumps from headrest down onto the left seat cushion (`top: 71.5%`, `left: 69%`).
   - Bellflower follows Sprout's jump and slips directly into the gap between the seat cushions (`top: 73.5%`, `left: 76.8%`) with feet dangling/kicking until rescued.
6. **Robust Hand Tracking & Pinch Pipeline**:
   - Stale-closure protection, pixel-accurate DOM bounding boxes (`lumori-orb-target`, `lumori-windmill-target`, `lumori-sofa-rescue-target`), EMA coordinate smoothing, dual hysteresis thresholds, and unified action dispatcher connected to mouse and webcam identically.

---

## 🛋️ Full Experience Sequence

- **0. Dormant Orb**: Orb rests calmly on shelf; subtle lights and silhouettes inside Lumori. Zero Lumis outside.
- **1. Emergence**: Lumori visibly step out of the orb onto the shelf, greet each other, and walk down to the living room.
- **2A–2G. Broken Windmill Field (Zoomed In)**: Interactive diorama on coffee table with tool search, cooperative repair, and continuous blade rotation.
- **2_ZOOM_OUT. Camera Zoom Out**: Smooth 1.4s camera pull-back to full living room framing.
- **3. Sofa Adventure**: Sprout lands on the seat cushion; Bellflower follows and falls into the seat cushion crevice with kicking feet!
- **4. Helping a Friend**: User can pinch/click Bellflower to help pull free, or Sprout helps autonomously after 6s.
- **4B. Rescued Reunion**: Bellflower is free on the seat cushion; both Lumori celebrate together with hearts and sparkles before auto-advancing to Free Play.
- **5. Free Play**: Joyful autonomous antics around the sofa cushions and armrest.
- **6. Return to Orb**: Triggered at any time by pinching at the orb or clicking the orb. Lumori sprint back to the shelf and climb inside.
- **7. Lumori Idling**: Persistent living decoration inside the orb. Lumori rest and explore miniature Lumori. They do not auto-emerge again.
- **6. Return to Orb**: Triggered at any time by pinching at the orb or clicking the orb. Lumori sprint back to the shelf and climb inside.
- **7. Lumori Idling**: Persistent living decoration inside the orb. Lumori rest and explore miniature Lumori. They do not auto-emerge again.

---

## 🚀 Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Verify Production Build
```bash
npm run build
```
Or test the GitHub Pages build specifically:
```bash
npm run build:gh-pages
```

---

## 📦 How to Create & Deploy to the New GitHub Repository

### Step 1: Create the New Repository on GitHub
1. Navigate to [GitHub New Repository](https://github.com/new).
2. Set **Repository name** to:
   ```
   Sony-Japan-Joint-Design-Living-Room-2026
   ```
3. Set visibility to **Public**.
4. Leave "Add a README file", ".gitignore", and license **unchecked**.
5. Click **Create repository**.

### Step 2: Push Code to the New Repository
```bash
git init
git add .
git commit -m "Update: Lumori Living Room with fixed emergence, robust hand tracking, and bright aesthetic"
git branch -M main
git remote add origin https://github.com/1990hello/Sony-Japan-Joint-Design-Living-Room-2026.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to **Settings** > **Pages** in the new repository.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically build and publish to:
   ```
   https://1990hello.github.io/Sony-Japan-Joint-Design-Living-Room-2026/
   ```

---

## 🧪 Acceptance Test Verification Matrix

| # | Feature / Test | Status | Details |
|---|----------------|:------:|---------|
| 1 | Zero Lumis outside on load | **Verified** | In State 0, 100% of Lumis are inside the orb. Zero Lumis outside. |
| 2 | Visible emergence sequence | **Verified** | State 1 shows Lumis visibly leaving orb aperture onto shelf before walking to table |
| 3 | Hand tracking alignment | **Verified** | Mirrored horizontal coords with EMA smoothing align with visual pinch reticle |
| 4 | Pinch on windmill triggers action | **Verified** | DOM bounding box hit test triggers `STATE_2D_INTERACTION` |
| 5 | Pinch on orb triggers return | **Verified** | DOM bounding box hit test triggers `STATE_6_RETURN_TO_ORB` |
| 6 | Pinch outside does not trigger | **Verified** | Rejects pinches outside active target bounding boxes |
| 7 | Hysteresis allows repeat pinches | **Verified** | Release resets lock immediately; dual thresholds prevent flickering |
| 8 | Mouse fallback parity | **Verified** | Mouse clicks and hold-pinch execute identical action dispatchers |
| 9 | Graceful camera failure handling | **Verified** | Clean fallback to mouse with permission status notice |
| 10 | Bright Scandinavian room palette | **Verified** | Ivory walls, blonde oak floors, light oak shelf & table, oatmeal linen sofa |
| 11 | State machine transitions | **Verified** | All states 0–7 and 2A–2G advance and transition deterministically |
| 12 | Production build passes | **Verified** | `npm run build` and `npm run build:gh-pages` succeed with 0 errors |
