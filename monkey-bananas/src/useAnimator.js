import { useRef, useCallback } from 'react';

/**
 * Smooth linear interpolation animation hook.
 * Returns an `animate(from, to, duration, onUpdate, onDone)` function
 * that uses requestAnimationFrame and an ease-in-out curve.
 */
export function useAnimator() {
  const rafRef = useRef(null);

  const cancel = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const animate = useCallback((from, to, duration, onUpdate, onDone) => {
    cancel();
    const start = performance.now();

    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = (now) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = easeInOut(raw);

      if (typeof from === 'object') {
        const result = {};
        for (const key of Object.keys(from)) {
          result[key] = lerp(from[key], to[key], eased);
        }
        onUpdate(result);
      } else {
        onUpdate(lerp(from, to, eased));
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return cancel;
  }, [cancel]);

  return { animate, cancel };
}
