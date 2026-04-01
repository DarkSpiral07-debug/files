import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

const DISK_COLORS = [
  '#ff6b35', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5',
  '#f72585', '#4cc9f0', '#fb8500'
]

const minMoves = (n) => Math.pow(2, n) - 1

function generateSolveSteps(n, from, to, aux, steps = []) {
  if (n === 0) return steps
  generateSolveSteps(n - 1, from, aux, to, steps)
  steps.push({ from, to })
  generateSolveSteps(n - 1, aux, to, from, steps)
  return steps
}

export default function App() {
  const [numDisks, setNumDisks] = useState(3)
  const [rods, setRods] = useState([[], [], []])
  const [selected, setSelected] = useState(null)
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [autoSolving, setAutoSolving] = useState(false)
  const [solveSteps, setSolveSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [speed, setSpeed] = useState(500)
  const [message, setMessage] = useState('')
  const [shake, setShake] = useState(null)
  const [highlight, setHighlight] = useState({ from: null, to: null })
  const autoRef = useRef(null)

  const initGame = useCallback((n) => {
    const disks = Array.from({ length: n }, (_, i) => n - i)
    setRods([disks, [], []])
    setSelected(null)
    setMoves(0)
    setWon(false)
    setAutoSolving(false)
    setSolveSteps([])
    setStepIndex(0)
    setMessage('')
    setHighlight({ from: null, to: null })
    clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    initGame(numDisks)
  }, [numDisks, initGame])

  useEffect(() => {
    if (!autoSolving || stepIndex >= solveSteps.length) {
      if (autoSolving && stepIndex >= solveSteps.length) {
        setAutoSolving(false)
        setHighlight({ from: null, to: null })
      }
      return
    }

    autoRef.current = setTimeout(() => {
      const { from, to } = solveSteps[stepIndex]
      setHighlight({ from, to })
      setRods(prev => {
        const next = prev.map(r => [...r])
        const disk = next[from].pop()
        next[to].push(disk)
        return next
      })
      setMoves(m => m + 1)
      setStepIndex(s => s + 1)
    }, speed)

    return () => clearTimeout(autoRef.current)
  }, [autoSolving, stepIndex, solveSteps, speed])

  useEffect(() => {
    if (!won) return
    setMessage(`🎉 Solved in ${moves} moves! Minimum: ${minMoves(numDisks)}`)
  }, [won, moves, numDisks])

  useEffect(() => {
    if (rods[2].length === numDisks && numDisks > 0) {
      setWon(true)
    }
  }, [rods, numDisks])

  const handleRodClick = (rodIdx) => {
    if (autoSolving || won) return

    if (selected === null) {
      if (rods[rodIdx].length === 0) {
        triggerShake(rodIdx)
        return
      }
      setSelected(rodIdx)
      setMessage('')
    } else {
      if (selected === rodIdx) {
        setSelected(null)
        return
      }

      const fromRod = rods[selected]
      const toRod = rods[rodIdx]
      const topFrom = fromRod[fromRod.length - 1]
      const topTo = toRod[toRod.length - 1]

      if (topTo && topTo < topFrom) {
        setMessage('❌ Cannot place larger disk on smaller!')
        triggerShake(rodIdx)
        setSelected(null)
        return
      }

      setRods(prev => {
        const next = prev.map(r => [...r])
        const disk = next[selected].pop()
        next[rodIdx].push(disk)
        return next
      })
      setMoves(m => m + 1)
      setSelected(null)
      setMessage('')
    }
  }

  const triggerShake = (idx) => {
    setShake(idx)
    setTimeout(() => setShake(null), 500)
  }

  const handleAutoSolve = () => {
    if (autoSolving) {
      clearTimeout(autoRef.current)
      setAutoSolving(false)
      setHighlight({ from: null, to: null })
      return
    }
    const steps = generateSolveSteps(numDisks, 0, 2, 1)
    initGame(numDisks)
    setTimeout(() => {
      setSolveSteps(steps)
      setStepIndex(0)
      setAutoSolving(true)
    }, 100)
  }

  const maxDiskWidth = 220
  const minDiskWidth = 44
  const diskHeight = 22

  const getDiskWidth = (disk) =>
    minDiskWidth + ((disk - 1) / (numDisks - 1 || 1)) * (maxDiskWidth - minDiskWidth)

  const rodNames = ['A', 'B', 'C']

  return (
    <div className="app">
      <div className="bg-grid" />
      <header className="header">
        <div className="title-block">
          <span className="tag">PUZZLE</span>
          <h1>Tower<br /><em>of Hanoi</em></h1>
        </div>
        <p className="subtitle">
          Move all disks from rod A to rod C.<br />
          Only one disk at a time. No larger disk on smaller.
        </p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label>DISKS</label>
          <div className="disk-buttons">
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <button
                key={n}
                className={`disk-btn ${numDisks === n ? 'active' : ''}`}
                onClick={() => { setNumDisks(n); }}
              >{n}</button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label>AUTO SPEED</label>
          <div className="speed-row">
            <input
              type="range" min={100} max={1000} step={100}
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="slider"
            />
            <span className="speed-val">{speed}ms</span>
          </div>
        </div>
        <div className="button-row">
          <button className="btn btn-reset" onClick={() => initGame(numDisks)}>↺ Reset</button>
          <button
            className={`btn btn-auto ${autoSolving ? 'solving' : ''}`}
            onClick={handleAutoSolve}
          >
            {autoSolving ? '⏹ Stop' : '▶ Auto Solve'}
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-val">{moves}</span>
          <span className="stat-label">MOVES</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">{minMoves(numDisks)}</span>
          <span className="stat-label">MINIMUM</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-val">{numDisks}</span>
          <span className="stat-label">DISKS</span>
        </div>
      </div>

      {message && (
        <div className={`message ${won ? 'win' : 'error'}`}>
          {message}
        </div>
      )}

      {autoSolving && (
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${(stepIndex / solveSteps.length) * 100}%` }}
          />
        </div>
      )}

      <div className="game-area">
        <div className="platform" />
        {rods.map((rod, ri) => (
          <div
            key={ri}
            className={[
              'rod-container',
              selected === ri ? 'rod-selected' : '',
              shake === ri ? 'rod-shake' : '',
              highlight.from === ri ? 'rod-highlight-from' : '',
              highlight.to === ri ? 'rod-highlight-to' : '',
            ].join(' ')}
            onClick={() => handleRodClick(ri)}
          >
            <div className="rod-name">{rodNames[ri]}</div>
            <div className="rod-area">
              <div className="rod-pole" />
              <div className="disks-stack">
                {rod.map((disk, di) => (
                  <div
                    key={di}
                    className="disk"
                    style={{
                      width: getDiskWidth(disk),
                      height: diskHeight,
                      background: DISK_COLORS[(disk - 1) % DISK_COLORS.length],
                      boxShadow: `0 4px 12px ${DISK_COLORS[(disk - 1) % DISK_COLORS.length]}55`,
                      zIndex: di,
                    }}
                  >
                    <span className="disk-label">{disk}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rod-base" />
          </div>
        ))}
      </div>

      {won && (
        <div className="win-overlay">
          <div className="win-card">
            <div className="win-emoji">🏆</div>
            <h2>Puzzle Solved!</h2>
            <p>You completed it in <strong>{moves}</strong> moves</p>
            <p className="min-note">Minimum possible: {minMoves(numDisks)}</p>
            {moves === minMoves(numDisks) && (
              <div className="perfect">⭐ PERFECT SCORE!</div>
            )}
            <button className="btn btn-reset big-btn" onClick={() => initGame(numDisks)}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Tower of Hanoi &mdash; Built with React + Vite</span>
      </footer>
    </div>
  )
}
