# 🗼 Tower of Hanoi

An interactive Tower of Hanoi puzzle built with **React + Vite**, deployable on Vercel.

## Features

- 🎮 **Interactive gameplay** — click rods to move disks
- 🤖 **Auto Solve** — watch the algorithm solve it step by step
- ⚡ **Adjustable speed** — control auto-solve animation speed
- 🎨 **2–8 disks** — vary difficulty
- 📊 **Move counter** with minimum move tracker
- 🏆 **Win screen** with perfect score detection

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Vite — click **Deploy**
5. Done! 🚀

## How to Play

1. Click a rod to **pick up** the top disk
2. Click another rod to **place** it there
3. Rules:
   - Only one disk at a time
   - Larger disks cannot go on top of smaller ones
   - Move all disks from rod **A** to rod **C**

## Minimum Moves Formula

`2^n - 1` where `n` = number of disks

| Disks | Min Moves |
|-------|-----------|
| 2     | 3         |
| 3     | 7         |
| 4     | 15        |
| 5     | 31        |
| 8     | 255       |
