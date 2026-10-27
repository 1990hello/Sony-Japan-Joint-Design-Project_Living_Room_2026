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

1. **Windmill Blades Restored with Single Parent Rotation Group**:
   - **Root Cause**: The blades were wrapped inside a zero-dimension flex container (`w-0 h-0 flex`) with uncontrolled flex-shrink and viewBox offsets, causing the blade container to collapse or clip in certain render states.
   - **Fix**: Re-architected the blade assembly to use a single parent group `<g className="windmill-blade-group ...">` inside a properly sized SVG positioned at the hub axle `(left: 50%, top: 100%)`.
   - **Pivot & Centering**: The center axle hub cap is located at `(0, 0)` within the exact same SVG coordinate space, with CSS `transform-origin: 0px 0px; transform-box: view-box;`.
   - **Permanent Rotation**: The rotation animation runs on pure CSS keyframes (`windmillRotate 1.8s linear infinite`), persisting seamlessly through camera zoom-out, sofa adventure, Free Play, and return-to-orb states without resetting on React re-renders.

2. **Consistent Cursor Visual Feedback (White → Blue → Orange)**:
   - **Root Cause**: Mousemove and frame update loops were calling `setTrackingState` without explicitly carrying forward `isPinching: isPinchingRef.current || isMouseDownRef.current`, causing hover updates to occasionally overwrite the orange pinch state back to blue.
   - **Fix**: Decoupled hover and pinch presentation. The cursor reticle explicitly checks:
     - **White**: Normal state; no interactive target hovered.
     - **Blue**: Hovering over interactive target (`isTargetHit && !isPinching`).
     - **Orange**: Active pinch detected (`isPinching`), whether over the orb, windmill, sofa, or general room.
   - Added `isMouseDownRef` tracking to guarantee that hover updates never overwrite active pinch feedback. Also added synchronized hover/pinch feedback rings on the windmill and sofa target crevice.

3. **Step-by-Step Camera-to-Sofa Jump Sequence**:
   - **Root Cause**: `STATE_3_SOFA_ADVENTURE` was previously rendering Bellflower immediately in the trapped position, skipping the intermediate jump animations.
   - **Fix**: Structured the sofa sequence into explicit, ordered sub-states:
     - **State 2 (Zoom Out)**: Camera smoothly pulls back (1.4s) to full living-room framing and settles completely before sofa action begins.
     - **State 3A (First Lumi on Headrest)**: Sprout moves to the top of the sofa headrest with a clear, upright starting pose (`top: 53%`, `left: 71%`).
     - **State 3B (First Lumi Jumps Down)**: Sprout visibly leaps forward and downward from headrest onto the left seat cushion (`top: 71.5%`, `left: 69%`), lands, and settles happily.
     - **State 3C (Second Lumi on Headrest)**: Bellflower hops up to the headrest with a clear starting pose (`top: 53%`, `left: 76.8%`, upright, not stuck).
     - **State 3D (Second Lumi Jumps & Becomes Trapped)**: Bellflower leaps forward and downward, slips into the seat cushion crevice (`top: 73.5%`, `left: 76.8%`), and only then becomes trapped (`isStuck={true}`) with kicking feet.
     - **State 4 (Rescue)**: User-assisted rescue or autonomous rescue after 6s.
     - **State 4B (Reunion)**: Both Lumori celebrate together with hearts and sparkles.
     - **State 5 (Free Play)**: Automatic progression to joyful antics around the sofa cushions.

---

## 🛋️ Full Experience Sequence

- **0. Dormant Orb**: Orb rests calmly on shelf; subtle lights and silhouettes inside Lumori. Zero Lumis outside.
- **1. Emergence**: Lumori visibly step out of the orb onto the shelf, greet each other, and walk down to the living room.
- **2A–2G. Broken Windmill Field (Zoomed In)**: Interactive diorama on coffee table with tool search, cooperative repair, and continuous blade rotation.
- **2_ZOOM_OUT. Camera Zoom Out**: Smooth 1.4s camera pull-back to full living room framing; windmill remains spinning continuously.
- **3A. Sprout Reaches Headrest**: Sprout perches on top of sofa headrest.
- **3B. Sprout Jumps Down**: Sprout visibly jumps onto left seat cushion and calls Bellflower.
- **3C. Bellflower Reaches Headrest**: Bellflower hops onto headrest with clear starting pose.
- **3D. Bellflower Jumps & Becomes Trapped**: Bellflower leaps down, slips into the seat cushion crevice, and only then becomes trapped with kicking feet!
- **4. Helping a Friend**: User can pinch/click Bellflower to help pull free, or Sprout heaves him out autonomously.
- **4B. Rescued Reunion**: Bellflower is freed onto seat cushion; both celebrate with happy chirps and sparkles before automatically advancing.
- **5. Free Play**: Joyful autonomous antics around the sofa cushions and armrest.
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
