"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.4,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;

    if (reduced) {
      hasAnimated.current = true;
      requestAnimationFrame(() => setDisplay(value));
      return;
    }

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        hasAnimated.current = true;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  const shown = reduced && inView ? value : display;

  return (
    <span ref={ref} className={cn("font-mono-amount tabular-nums", className)}>
      {prefix}
      {shown.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
