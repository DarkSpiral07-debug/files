# 🐒 Monkey & Bananas — AI Planning Visualizer

An interactive visualization of the classic **Monkey and Bananas** AI planning problem, implemented using **STRIPS** (Stanford Research Institute Problem Solver) planning formalism.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/monkey-bananas-ai)

---

## 🧠 The Problem

> A monkey is at location **A**. Bananas hang from the ceiling at location **B** (too high to reach). A box sits at location **C**. How can the monkey get the bananas?

| Entity | Start | Height |
|--------|-------|--------|
| Monkey | A     | Low    |
| Box    | C     | Low    |
| Bananas| B     | High   |

---

## 🤖 AI Model — STRIPS Planning

STRIPS represents the world as a set of predicates and defines **operators** with:
- **Preconditions** — what must be true before the action
- **Effects** — what changes after the action

### Operators

| Operator | Preconditions | Effects |
|----------|--------------|---------|
| `walk_to(loc)` | height=low | monkeyAt=loc |
| `push_box(from, to)` | height=low, monkeyAt=from, boxAt=from | monkeyAt=to, boxAt=to |
| `climb_box()` | height=low, monkeyAt=boxAt | height=high |
| `grasp(bananas)` | height=high, monkeyAt=B | hasBanana=true |

### The Plan (Backward Chaining)

```
Initial: monkeyAt=A, boxAt=C, height=low, hasBanana=false
Goal:    hasBanana=true

Step 1: walk_to(C)        → monkeyAt=C
Step 2: push_box(C→B)     → monkeyAt=B, boxAt=B
Step 3: climb_box()       → height=high
Step 4: grasp(bananas)    → hasBanana=true ✓
```

---

## 🚀 Deploy on Vercel (One Click)

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your forked repo
4. Click **Deploy** — done!

Or use the button at the top of this README.

---

## 🛠 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/monkey-bananas-ai.git
cd monkey-bananas-ai

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
monkey-bananas-ai/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # Root component + animation orchestration
    ├── App.module.css
    ├── index.css               # Global styles
    ├── planner.js              # STRIPS planner logic (operators, plan generation)
    ├── useAnimator.js          # RAF-based animation hook
    └── components/
        ├── Scene.jsx           # SVG scene (monkey, box, bananas, animations)
        ├── Scene.module.css
        ├── StatePanel.jsx      # Live world state display
        ├── StatePanel.module.css
        ├── PlanPanel.jsx       # Step-by-step plan list
        ├── PlanPanel.module.css
        ├── InfoPanel.jsx       # Accordion — theory explanations
        └── InfoPanel.module.css
```

---

## 🧩 Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool
- **CSS Modules** — scoped styles
- **SVG** — scene animation (no canvas, no game engine)
- **requestAnimationFrame** — smooth custom animations

---

## 📖 References

- Fikes, R. E., & Nilsson, N. J. (1971). *STRIPS: A new approach to the application of theorem proving to problem solving.* Artificial Intelligence, 2(3–4), 189–208.
- Russell, S., & Norvig, P. *Artificial Intelligence: A Modern Approach* (Chapter 10 — Classical Planning)

---

## 📄 License

MIT © 2024
