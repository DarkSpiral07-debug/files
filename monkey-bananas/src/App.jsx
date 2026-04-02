import React, { useState, useRef, useCallback } from 'react';
import Scene from './components/Scene.jsx';
import StatePanel from './components/StatePanel.jsx';
import PlanPanel from './components/PlanPanel.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import { PLAN, INITIAL_STATE } from './planner.js';
import styles from './App.module.css';

const LOC_X   = { A: 110, B: 340, C: 580 };
const STAND_Y = 176; // monkey feet on ground (y=220 - 44 body offset)
const BOX_H   = 37;
const ON_BOX_Y = STAND_Y - BOX_H;

const INIT_VIS = {
  monkeyX: LOC_X.A,
  monkeyY: STAND_Y,
  boxX:    LOC_X.C,
};

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - 2*(1-t)*(1-t); }

function animateValue(from, to, duration, onUpdate, onDone) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const e = easeInOut(t);
    if (typeof from === 'object') {
      const res = {};
      for (const k of Object.keys(from)) res[k] = lerp(from[k], to[k], e);
      onUpdate(res);
    } else {
      onUpdate(lerp(from, to, e));
    }
    if (t < 1) requestAnimationFrame(tick);
    else onDone?.();
  }
  requestAnimationFrame(tick);
}

export default function App() {
  const [activeStep, setActiveStep] = useState(-1);
  const [worldState, setWorldState] = useState(INITIAL_STATE);
  const [prevState, setPrevState] = useState(null);
  const [vis, setVis] = useState(INIT_VIS);
  const [badge, setBadge] = useState('');
  const [showBananas, setShowBananas] = useState(false);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const stepRef = useRef(0);
  const rafRef = useRef(null);

  const BASE = 700;
  const dur = (x) => (BASE * x) / speed;

  const showBadge = (text) => {
    setBadge(text);
    setTimeout(() => setBadge(''), 1600 / speed);
  };

  const runStep = useCallback((stepIdx, onDone) => {
    const step = PLAN[stepIdx];
    setActiveStep(stepIdx);
    setPrevState(worldState);
    showBadge(step.label);

    if (stepIdx === 0) {
      // walk A → C
      animateValue(
        { x: LOC_X.A }, { x: LOC_X.C }, dur(1.4),
        (v) => setVis((prev) => ({ ...prev, monkeyX: v.x })),
        () => { setWorldState(step.state); onDone(); }
      );
    } else if (stepIdx === 1) {
      // push box C → B (monkey + box move together)
      let doneCount = 0;
      const check = () => { if (++doneCount === 2) { setWorldState(step.state); onDone(); } };
      animateValue(
        { x: LOC_X.C }, { x: LOC_X.B }, dur(1.8),
        (v) => setVis((prev) => ({ ...prev, monkeyX: v.x, boxX: v.x })),
        check
      );
      // second call intentionally mirrors the first
      setTimeout(check, dur(1.8));
    } else if (stepIdx === 2) {
      // climb box — monkey rises by BOX_H
      animateValue(
        { y: STAND_Y }, { y: ON_BOX_Y }, dur(0.9),
        (v) => setVis((prev) => ({ ...prev, monkeyY: v.y })),
        () => { setWorldState(step.state); onDone(); }
      );
    } else if (stepIdx === 3) {
      // grasp — arm stretch up, then back
      animateValue(
        { y: ON_BOX_Y }, { y: ON_BOX_Y - 72 }, dur(0.8),
        (v) => setVis((prev) => ({ ...prev, monkeyY: v.y })),
        () => {
          setTimeout(() => {
            animateValue(
              { y: ON_BOX_Y - 72 }, { y: ON_BOX_Y }, dur(0.7),
              (v) => setVis((prev) => ({ ...prev, monkeyY: v.y })),
              () => { setShowBananas(true); setWorldState(step.state); onDone(); }
            );
          }, 300 / speed);
        }
      );
    } else if (stepIdx === 4) {
      // goal step
      setTimeout(() => {
        setWorldState(step.state);
        setGoalAchieved(true);
        onDone();
      }, 500 / speed);
    }
  }, [speed, worldState]);

  const play = useCallback(() => {
    if (running) return;
    setRunning(true);
    let idx = activeStep + 1 < 0 ? 0 : activeStep + 1;
    if (idx >= PLAN.length) { setRunning(false); return; }

    function next(i) {
      if (i >= PLAN.length) { setRunning(false); return; }
      setTimeout(() => {
        runStep(i, () => next(i + 1));
      }, 400 / speed);
    }
    next(idx);
  }, [running, activeStep, speed, runStep]);

  const reset = useCallback(() => {
    setRunning(false);
    setActiveStep(-1);
    setWorldState(INITIAL_STATE);
    setPrevState(null);
    setVis(INIT_VIS);
    setBadge('');
    setShowBananas(false);
    setGoalAchieved(false);
    stepRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>🐒</div>
          <div>
            <h1 className={styles.title}>Monkey &amp; Bananas</h1>
            <p className={styles.subtitle}>Classical AI Planning · STRIPS · State-space search</p>
          </div>
          <a
            className={styles.ghLink}
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <Scene
          monkeyX={vis.monkeyX}
          monkeyY={vis.monkeyY}
          boxX={vis.boxX}
          showBananas={showBananas}
          actionBadge={badge}
          goalAchieved={goalAchieved}
        />

        <div className={styles.controls}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={play}
            disabled={running || goalAchieved}
          >
            {running ? '⏳ Running…' : activeStep === -1 ? '▶ Run Plan' : '▶ Continue'}
          </button>
          <button className={styles.btn} onClick={reset}>↺ Reset</button>

          <div className={styles.speedWrap}>
            <span className={styles.speedLabel}>Speed</span>
            <input
              type="range" min="0.5" max="3" step="0.5" value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={styles.speedSlider}
            />
            <span className={styles.speedVal}>{speed}×</span>
          </div>
        </div>

        <div className={styles.panels}>
          <StatePanel state={worldState} prevState={prevState} />
          <PlanPanel steps={PLAN} activeStep={activeStep} />
        </div>

        <div className={styles.infoWrap}>
          <InfoPanel />
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Monkey &amp; Bananas — STRIPS AI Planning Visualizer</span>
        <span>Built with React + Vite · Deploy on Vercel</span>
      </footer>
    </div>
  );
}
