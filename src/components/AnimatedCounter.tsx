import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * Count-up animation that triggers when the element scrolls into view.
 * Uses framer-motion's animate + useInView hooks.
 */
export default function AnimatedCounter({ value, duration = 1.4, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
    </span>
  );
}