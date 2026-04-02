import React, { useState } from 'react';
import styles from './InfoPanel.module.css';

const sections = [
  {
    title: 'The Problem',
    content: `A monkey is in a room. Bananas hang from the ceiling at location B — too high to reach directly. A box sits at location C. The monkey starts at A. Goal: get the bananas.`,
  },
  {
    title: 'STRIPS Planning',
    content: `STRIPS (Stanford Research Institute Problem Solver, 1971) is a classical AI planning formalism. It defines a world via predicates, a set of operators with preconditions and effects, and searches for a sequence of operators that transforms the initial state into the goal state.`,
  },
  {
    title: 'Operators',
    content: `walk_to(loc) — precond: height=low. push_box(from,to) — precond: height=low, monkey and box at same loc. climb_box() — precond: height=low, monkey at box. grasp(bananas) — precond: height=high, monkey at banana loc.`,
  },
  {
    title: 'Backward Chaining',
    content: `The planner works backward from the goal. To achieve has_banana=true, the monkey must be at B and height=high. To reach height=high, it must climb the box. For that, the box must be at B. So it pushes the box from C→B first, then climbs, then grasps.`,
  },
];

export default function InfoPanel() {
  const [open, setOpen] = useState(null);

  return (
    <div className={styles.wrap}>
      {sections.map((s, i) => (
        <div key={i} className={styles.item}>
          <button
            className={`${styles.trigger} ${open === i ? styles.triggerOpen : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{s.title}</span>
            <span className={styles.arrow}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className={styles.body}>{s.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
