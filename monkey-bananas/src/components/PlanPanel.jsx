import React from 'react';
import styles from './PlanPanel.module.css';

export default function PlanPanel({ steps, activeStep }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>AI Plan · STRIPS</div>
      <div className={styles.list}>
        {steps.map((step, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
          return (
            <div key={i} className={`${styles.item} ${styles[state]}`}>
              <div className={`${styles.num} ${styles['num_' + state]}`}>{i + 1}</div>
              <div className={styles.content}>
                <div className={styles.label}>{step.label}</div>
                <div className={styles.desc}>{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
