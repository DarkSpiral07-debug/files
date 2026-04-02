import React from 'react';
import styles from './StatePanel.module.css';

export default function StatePanel({ state, prevState }) {
  const rows = [
    { key: 'monkey_at',    val: state.monkeyAt },
    { key: 'box_at',       val: state.boxAt },
    { key: 'monkey_h',     val: state.monkeyHeight },
    { key: 'has_banana',   val: String(state.hasBanana) },
  ];

  const prevRows = prevState
    ? [prevState.monkeyAt, prevState.boxAt, prevState.monkeyHeight, String(prevState.hasBanana)]
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>World State</div>
      <div className={styles.grid}>
        {rows.map(({ key, val }, i) => {
          const changed = prevRows && prevRows[i] !== val;
          return (
            <div className={styles.row} key={key}>
              <span className={styles.key}>{key}</span>
              <span className={`${styles.val} ${changed ? styles.changed : ''}`}>{val}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.note}>
        STRIPS state — updated after each operator
      </div>
    </div>
  );
}
