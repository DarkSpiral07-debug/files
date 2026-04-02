import React from 'react';
import styles from './Scene.module.css';

const LOC_X = { A: 110, B: 340, C: 580 };
const GROUND_Y = 220;
const BOX_H = 37;
const MONKEY_STAND_Y = GROUND_Y - 44; // feet on ground
const MONKEY_ON_BOX_Y = GROUND_Y - BOX_H - 44;

export default function Scene({ monkeyX, monkeyY, boxX, climbOffset, showBananas, actionBadge, goalAchieved }) {
  const mTx = monkeyX - LOC_X.A;
  const mTy = monkeyY - MONKEY_STAND_Y;
  const bDx = boxX - LOC_X.C;

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 680 280"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Monkey and Bananas scene"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e3320" />
            <stop offset="100%" stopColor="#1a4a2e" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d5a1e" />
            <stop offset="100%" stopColor="#1a3a10" />
          </linearGradient>
          <linearGradient id="bananaBunch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9e44a" />
            <stop offset="100%" stopColor="#d4a90d" />
          </linearGradient>
          <linearGradient id="boxWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4ac60" />
            <stop offset="100%" stopColor="#a07830" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="680" height="280" fill="url(#skyGrad)" />

        {/* Stars / dots for atmosphere */}
        {[[60,30],[200,18],[480,25],[600,40],[150,55],[520,12]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.3)" />
        ))}

        {/* Ground */}
        <rect x="0" y={GROUND_Y} width="680" height="60" fill="url(#groundGrad)" />
        <line x1="0" y1={GROUND_Y+8} x2="680" y2={GROUND_Y+8} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Location markers */}
        {['A','B','C'].map((loc, i) => {
          const x = [LOC_X.A, LOC_X.B, LOC_X.C][i];
          return (
            <g key={loc}>
              <line x1={x} y1={GROUND_Y} x2={x} y2={GROUND_Y-10}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
              <text x={x} y={GROUND_Y+22} textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace" fontSize="11"
                fontWeight="600" fill="rgba(255,255,255,0.35)">{loc}</text>
            </g>
          );
        })}

        {/* Height reference */}
        <line x1="42" y1="62" x2="42" y2={GROUND_Y}
          stroke="rgba(244,208,63,0.2)" strokeWidth="0.5" strokeDasharray="4,4" />
        <text x="38" y="60" textAnchor="middle" fontFamily="'JetBrains Mono',monospace"
          fontSize="9" fill="rgba(244,208,63,0.4)">HIGH</text>
        <text x="38" y={GROUND_Y-4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace"
          fontSize="9" fill="rgba(244,208,63,0.4)">LOW</text>
        <line x1="36" y1="63" x2="48" y2="63" stroke="rgba(244,208,63,0.3)" strokeWidth="0.5" />
        <line x1="36" y1={GROUND_Y-10} x2="48" y2={GROUND_Y-10} stroke="rgba(244,208,63,0.3)" strokeWidth="0.5" />

        {/* Ceiling rope */}
        <line x1="340" y1="0" x2="340" y2="52"
          stroke="#6b4a1a" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bananas */}
        <g id="bananas" filter={goalAchieved ? 'url(#glow)' : undefined}>
          <ellipse cx="340" cy="60" rx="18" ry="9" fill="url(#bananaBunch)" stroke="#c9960a" strokeWidth="1" />
          <path d="M330,55 Q340,47 350,55" fill="none" stroke="#c9960a" strokeWidth="1.5" />
          <ellipse cx="328" cy="63" rx="12" ry="5" fill="#f4d03f" stroke="#c9960a" strokeWidth="0.8" />
          <ellipse cx="352" cy="63" rx="12" ry="5" fill="#f4d03f" stroke="#c9960a" strokeWidth="0.8" />
          <ellipse cx="323" cy="70" rx="10" ry="4" fill="#edc826" stroke="#b88a08" strokeWidth="0.8" />
          <ellipse cx="340" cy="72" rx="11" ry="4.5" fill="#f4d03f" stroke="#c9960a" strokeWidth="0.8" />
          <ellipse cx="357" cy="70" rx="10" ry="4" fill="#edc826" stroke="#b88a08" strokeWidth="0.8" />
        </g>

        {/* Bananas in hand (goal achieved) */}
        {showBananas && (
          <g transform={`translate(${mTx + 42}, ${mTy - 32})`} opacity={showBananas ? 1 : 0}
            style={{ transition: 'opacity 0.4s' }}>
            <ellipse cx="110" cy="0" rx="11" ry="5" fill="#f4d03f" stroke="#c9960a" strokeWidth="1" />
            <ellipse cx="101" cy="6" rx="9" ry="4" fill="#f4d03f" stroke="#c9960a" strokeWidth="0.8" />
            <ellipse cx="119" cy="6" rx="9" ry="4" fill="#edc826" stroke="#b88a08" strokeWidth="0.8" />
          </g>
        )}

        {/* Box */}
        <g transform={`translate(${bDx}, 0)`}>
          <rect x="553" y={GROUND_Y - BOX_H} width="54" height={BOX_H}
            rx="4" fill="url(#boxWood)" stroke="#7a5520" strokeWidth="1.5" />
          <line x1="553" y1={GROUND_Y - BOX_H + 18} x2="607" y2={GROUND_Y - BOX_H + 18}
            stroke="#7a5520" strokeWidth="0.8" opacity="0.5" />
          <line x1="580" y1={GROUND_Y - BOX_H} x2="580" y2={GROUND_Y}
            stroke="#7a5520" strokeWidth="0.8" opacity="0.5" />
          <text x="580" y={GROUND_Y - BOX_H + 22} textAnchor="middle"
            fontFamily="'Syne', sans-serif" fontSize="9" fontWeight="700" fill="#5a3a10">BOX</text>
        </g>

        {/* Monkey */}
        <g transform={`translate(${mTx}, ${mTy})`}>
          {/* Tail */}
          <path d="M92,210 Q65,232 78,250 Q88,265 102,258"
            stroke="#5a2e1e" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <path d="M100,220 Q96,232 93,244" stroke="#5a2e1e" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M120,220 Q124,232 127,244" stroke="#5a2e1e" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="110" cy="200" rx="18" ry="22" fill="#6b3a2a" stroke="#3d1f0f" strokeWidth="1" />
          <ellipse cx="110" cy="205" rx="11" ry="13" fill="#b87a5a" opacity="0.65" />
          {/* Arms */}
          <path d="M93,198 Q75,212 67,220" stroke="#5a2e1e" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path
            d={showBananas
              ? "M127,195 Q145,178 152,165"
              : "M127,198 Q145,212 153,220"}
            stroke="#5a2e1e" strokeWidth="7" fill="none" strokeLinecap="round"
            style={{ transition: 'all 0.4s ease' }}
          />
          {/* Head */}
          <circle cx="110" cy="175" r="16" fill="#6b3a2a" stroke="#3d1f0f" strokeWidth="1" />
          {/* Ears */}
          <circle cx="95" cy="175" r="6" fill="#6b3a2a" stroke="#3d1f0f" strokeWidth="1" />
          <circle cx="125" cy="175" r="6" fill="#6b3a2a" stroke="#3d1f0f" strokeWidth="1" />
          <circle cx="95" cy="175" r="3" fill="#b87a5a" />
          <circle cx="125" cy="175" r="3" fill="#b87a5a" />
          {/* Face */}
          <ellipse cx="110" cy="178" rx="10" ry="8" fill="#c09070" />
          {/* Eyes */}
          <circle cx="106" cy="173" r="2.5" fill="#1a0800" />
          <circle cx="114" cy="173" r="2.5" fill="#1a0800" />
          <circle cx="107" cy="172" r="0.9" fill="white" />
          <circle cx="115" cy="172" r="0.9" fill="white" />
          {/* Mouth */}
          <path
            d={goalAchieved ? "M104,180 Q110,186 116,180" : "M105,180 Q110,184 115,180"}
            stroke="#5a2a10" strokeWidth="1.2" fill="none" strokeLinecap="round"
            style={{ transition: 'd 0.3s' }}
          />
          {/* Nostrils */}
          <circle cx="108" cy="182" r="0.8" fill="#5a2a10" opacity="0.5" />
          <circle cx="112" cy="182" r="0.8" fill="#5a2a10" opacity="0.5" />
        </g>

        {/* Action badge */}
        {actionBadge && (
          <g>
            <rect x="460" y="14" width={actionBadge.length * 7.2 + 24} height="26" rx="13"
              fill="rgba(0,0,0,0.7)" />
            <text x={460 + (actionBadge.length * 7.2 + 24) / 2} y="31" textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace" fontSize="11.5" fill="#f4d03f">{actionBadge}</text>
          </g>
        )}
      </svg>

      {/* Goal overlay */}
      {goalAchieved && (
        <div className={styles.goalOverlay}>
          <div className={styles.goalBox}>
            <div className={styles.goalEmoji}>🍌</div>
            <h2 className={styles.goalTitle}>Goal Achieved!</h2>
            <p className={styles.goalSub}>Plan executed in 4 actions · has_banana = true</p>
          </div>
        </div>
      )}
    </div>
  );
}
