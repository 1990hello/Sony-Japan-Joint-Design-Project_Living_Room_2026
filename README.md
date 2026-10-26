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

- **State 2A — Discovery**: A miniature field with rustic wooden windmill appears on the coffee table. The 4 Lumori gather around the broken, stalled windmill.
- **State 2B — Observation**: The Lumori inspect the stalled blades. Sprout inspects the axle from the upper platform; Bellflower tries to push the lower blade; Lotus inspects the base cog with a small wrench; Sakura holds a toolbox looking anxious.
- **State 2C — Invitation**: The Lumori gesture toward the user inviting help. A subtle visual cue appears (blowing breath icon, waving hand icon, rotating arrow ring around the hub).
- **State 2D — User Interaction**: The user assists by waving, performing a pinch gesture near the windmill, or clicking the windmill. The blades catch the breeze and accelerate.
- **State 2E — Autonomous Solution**: If the user chooses not to interact within 6.5s, the Lumori coordinate their efforts (tapping the cog and pushing the blades in unison) to unlock the mechanism autonomously.
- **State 2F — Success**: The windmill spins smoothly with a golden blur. Glowing flower petals and pollen drift into the air; all four Lumori cheer, jump, and celebrate (`♫`, `♥`, `^.^`).
- **State 2G — Closure**: The activity gradually settles. The Lumori rest contentedly near the working windmill before moving toward the sofa.

---

## 🛋️ Full Experience Sequence

- **0. Dormant Orb**: Orb rests calmly on shelf; subtle lights and silhouettes inside Lumori.
- **1. Emergence**: Lumori emerge from the orb and travel down to the living room.
- **2. Broken Windmill Field**: Sub-states 2A–2G as described above.
- **3. Sofa Adventure**: Sprout Lumi bounds onto sofa headrest and cushion; Bellflower copies the jump and slips comically into the cushion gap with feet kicking!
- **4. Helping a Friend**: User can pinch/click Bellflower to help pull free, or Sprout braces and heaves him out after 5.5s.
- **5. Free Play**: Joyful autonomous play around the sofa.
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
git commit -m "Initial commit: Lumori Living Room Prototype with Broken Windmill Field"
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
| 1 | Independent repo configuration | Verified | Target repo: `Sony-Japan-Joint-Design-Living-Room-2026` |
| 2 | Preserves previous corridor project | Verified | Existing repository remains untouched |
| 3 | 4 Authoritative Lumori characters | Verified | Sprout, Bellflower, Sakura, and Lotus implemented with exact Miro specs |
| 4 | Broken Windmill Field (2A–2G) | Verified | 6 stages from Miro storyboard with sub-state transitions |
| 5 | User-assisted interaction | Verified | Wave / pinch gesture proxy and mouse click on blades |
| 6 | Autonomous solution fallback | Verified | Lumori coordinate solve after 6.5s if user does not interact |
| 7 | Success celebration & drifting petals | Verified | Smooth blade spin, floating sakura petals & sparkles |
| 8 | Sofa jump & cushion stuck state | Verified | Kiko/Sprout jumps; Bellflower gets stuck kicking feet |
| 9 | Sofa rescue interaction | Verified | Click/pinch pull or autonomous heave |
| 10 | Free play & persistent orb idling | Verified | Pinch/click orb triggers return; Lumori stay inside orb |
| 11 | In-app Storyboard reference viewer | Verified | Interactive modal displays `image_ddf866d7.png` and `image_f00e7209.png` |
| 12 | Production build passes | Verified | `npm run build` and `npm run build:gh-pages` succeed with 0 errors |
